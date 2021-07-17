const { getDatabase } = require("../../util/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
let transporter = require("../../util/mail");

exports.getLogin = (req, res, next) => {
  res.render("project1Views/pages/auth/login", {
    path: "/project1/login",
    pageTitle: "Login",
    errorMessage: req.flash("error"),
    oldInput: { email: "", password: "" },
    validationErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
  res.render("project1Views/pages/auth/signup", {
    path: "/project1/signup",
    pageTitle: "Signup",
    errorMessage: req.flash("error"),
    oldInput: { email: "", password: "", confirmPassword: "" },
    validationErrors: [],
  });
};

exports.postLogin = async (req, res, next) => {
  const db = await getDatabase();
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("project1Views/pages/auth/login", {
      path: "/project1/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array(),
    });
  }
  db.Project1User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/project1/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/project1");
            });
          }
          req.flash("error", "Invalid email or password.");
          res.redirect("/project1/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/project1/login");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignup = async (req, res, next) => {
  const db = await getDatabase();
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("project1Views/pages/auth/signup", {
      path: "/project1/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array(),
    });
  }

  return bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new db.Project1User({
        email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/project1/login");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/project1");
  });
};

exports.getForgetPassword = (req, res, next) => {
  res.render("project1Views/pages/auth/forgot-password", {
    path: "/project1/forgot-password",
    pageTitle: "Forgot Password",
    errorMessage: req.flash("error"),
    successMessage: req.flash("success"),
  });
};

exports.postForgetPassword = async (req, res, next) => {
  try {
    const db = await getDatabase();
    const buffer = await crypto.randomBytes(32);
    const token = buffer.toString("hex");
    if (!req.body.email) {
      req.flash("error", "Please enter an email");
      return res.redirect("back");
    }
    const user = await db.Project1User.findOne({ email: req.body.email });
    if (!user) {
      req.flash("error", "No account with that email found");
      return res.redirect("back");
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 360000;
    await user.save();
    const fullUrl = req.protocol + "://" + req.get("host");
    const info = await transporter.sendMail({
      from: '"Elvis Duru" <hello@elvisduru.com>',
      to: req.body.email,
      subject: "Password Reset",
      html: `
      <p>You requested a password reset</p>
      <p>Click this <a href="${fullUrl}/project1/reset/${token}">link</a> to set a new password
    `,
    });
    if (!info) {
      req.flash("error", "Error sending token. Please try again");
    }
    req.flash("success", "Please check your email for a link");
    res.redirect("back");
  } catch (error) {
    error = new Error(error);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getReset = async (req, res, next) => {
  try {
    const token = req.params.token;
    const db = await getDatabase();
    const user = await db.Project1User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      req.flash("error", "Token expired. Try again");
      return res.redirect("/project1/login");
    }
    res.render("project1Views/pages/auth/reset", {
      path: "/project1/reset",
      pageTitle: "New Password",
      errorMessage: req.flash("error"),
      userId: user._id.toString(),
      passwordToken: token,
    });
  } catch (error) {
    error = new Error(error);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postReset = async (req, res, next) => {
  try {
    const { password: newPassword, userId, passwordToken } = req.body;
    const db = await getDatabase();
    const user = await db.Project1User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });
    if (!user) {
      req.flash("error", "Token expired. Try again");
      return res.redirect("/project1/login");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.redirect("/project1/login");
  } catch (error) {
    error = new Error(error);
    error.httpStatusCode = 500;
    return next(error);
  }
};
