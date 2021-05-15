const express = require("express");
const router = express.Router();

const proveRoutes = require("./proveRoutes");
const teamRoutes = require("./teamRoutes");
const classRoutes = require("./classRoutes");

router
  .use("/prove", proveRoutes)
  .use("/team", teamRoutes)
  .use("/class", classRoutes);

module.exports = router;
