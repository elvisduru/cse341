const express = require("express");
const router = express.Router();

const adminRoutes = require("./admin");
const shopRoutes = require("./shop");

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
  .use("/admin", adminRoutes)
  .use(shopRoutes);

module.exports = router;
