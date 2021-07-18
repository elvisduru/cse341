const express = require("express");
const router = express.Router();

const shopRoutes = require("./shop");

router.use(shopRoutes);

module.exports = router;
