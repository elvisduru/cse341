const express = require("express");
const router = express.Router();

const proveRoutes = require("./proveRoutes");
const teamRoutes = require("./teamRoutes");

router.use("/prove", proveRoutes);
router.use("/team", teamRoutes);

module.exports = router;
