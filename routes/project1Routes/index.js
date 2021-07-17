const express = require("express");
const router = express.Router();

const adminRoutes = require("./admin");
const shopRoutes = require("./shop");
const authRoutes = require("./auth");

const isAuth = require("../../middleware/project/is-auth");

const { getDatabase } = require("../../util/db");

router
  .use(async (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return next();
    }
    const db = await getDatabase();
    db.Project1User.findById(req.session.user._id)
      .then((user) => {
        if (!user) {
          return next();
        }
        req.user = user;
        next();
      })
      .catch((err) => {
        next(new Error(err));
      });
  })
  .use("/admin", isAuth, adminRoutes)
  .use(shopRoutes)
  .use(authRoutes);

module.exports = router;
