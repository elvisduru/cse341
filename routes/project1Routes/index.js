const express = require("express");
const router = express.Router();

const adminRoutes = require("./admin");
const shopRoutes = require("./shop");
const authRoutes = require("./auth");

const isAuth = require("../../middleware/project/is-auth");

const { getDatabase } = require("../../util/db");

router
  .use(async (req, res, next) => {
    const db = await getDatabase();
    db.Project1User.findById("60bcceefb6569a0c66376345")
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => console.log(err));
  })
  .use("/admin", isAuth, adminRoutes)
  .use(shopRoutes)
  .use(authRoutes);

module.exports = router;
