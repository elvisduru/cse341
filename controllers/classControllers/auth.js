const { getDatabase } = require("../../util/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
let transporter = require("../../util/mail");
const { validationResult } = require("express-validator");

exports.getLogin = (req, res, next) => {
  res.render("classViews/pages/auth/login", {
    path: "/class/login",
    pageTitle: "Login",
    errorMessage: req.flash("error"),
    oldInput: { email: "", password: "" },
    validationErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
  res.render("classViews/pages/auth/signup", {
    path: "/class/signup",
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
    return res.status(422).render("classViews/pages/auth/login", {
      path: "/class/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array(),
    });
  }
  db.ClassUser.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/class/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/class");
            });
          }
          req.flash("error", "Invalid email or password.");
          res.redirect("/class/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/class/login");
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
    return res.status(422).render("classViews/pages/auth/signup", {
      path: "/class/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array(),
    });
  }

  return bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new db.ClassUser({
        email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/class/login");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = async (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/class");
  });
};

exports.getReset = async (req, res, next) => {
  res.render("classViews/pages/auth/reset", {
    path: "/class/reset",
    pageTitle: "Reset Password",
    errorMessage: req.flash("error"),
  });
};

exports.postReset = async (req, res, next) => {
  const db = await getDatabase();
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/class/reset");
    }
    const token = buffer.toString("hex");
    db.ClassUser.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found");
          return res.redirect("/class/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 360000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/class");
        // send mail with defined transport object
        transporter.sendMail({
          from: '"Elvis Duru" <hello@elvisduru.com>',
          to: req.body.email,
          subject: "Password Reset",
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:5000/class/reset/${token}">link</a> to set a new password
          `,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  const db = await getDatabase();
  db.ClassUser.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Token expired. Try again");
        return res.redirect("/class/reset");
      }
      res.render("classViews/pages/auth/new-password", {
        path: "/class/new-password",
        pageTitle: "New Password",
        errorMessage: req.flash("error"),
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  const db = await getDatabase();
  let resetUser;
  db.ClassUser.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Token expired. Try again");
        return res.redirect("/class/reset");
      }
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/class/login");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
