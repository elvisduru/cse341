const { getDatabase } = require("../../util/db");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("classViews/pages/auth/login", {
    path: "/class/login",
    pageTitle: "Login",
    errorMessage: req.flash("error"),
  });
};

exports.getSignup = (req, res, next) => {
  res.render("classViews/pages/auth/signup", {
    path: "/class/signup",
    pageTitle: "Signup",
    errorMessage: req.flash("error"),
  });
};

exports.postLogin = async (req, res, next) => {
  const db = await getDatabase();
  const { email, password } = req.body;
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
    .catch((err) => console.log(err));
};

exports.postSignup = async (req, res, next) => {
  const db = await getDatabase();
  const { email, password, confirmPassword } = req.body;
  db.ClassUser.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email exists already. Please use a different one.");
        return res.redirect("/class/signup");
      }
      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new db.ClassUser({
          email,
          password: hashedPassword,
          cart: { items: [] },
        });
        return user.save();
      });
    })
    .then((result) => {
      res.redirect("/class/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = async (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/class");
  });
};
