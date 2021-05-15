const express = require("express");
const router = express.Router();

const adminData = require("./admin");
const shopRoutes = require("./shop");

router.use("/admin", adminData.routes).use(shopRoutes);

module.exports = router;
