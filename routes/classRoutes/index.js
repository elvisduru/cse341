const express = require("express");
const router = express.Router();

const isAuth = require("../../middleware/class/is-auth");

const adminRoutes = require("./admin");
const shopRoutes = require("./shop");
const authRoutes = require("./auth");
const { getDatabase } = require("../../util/db");

router
  .use((req, res, next) => {
    if (!req.session.isLoggedIn) {
      return next();
    }
    getDatabase()
      .then((db) => db.ClassUser.findById(req.session.user._id))
      .then((user) => {
        if (user) {
          if (!user) {
            return next();
          }
          req.user = user;
          next();
        }
      })
      .catch((err) => {
        next(new Error(err));
      });
  })
  .use("/admin", isAuth, adminRoutes)
  .use(shopRoutes)
  .use(authRoutes);

module.exports = router;
