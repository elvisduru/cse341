const express = require("express");
const router = express.Router();

const adminRoutes = require("./admin");
const shopRoutes = require("./shop");

router.use("/admin", adminRoutes).use(shopRoutes);

module.exports = router;
