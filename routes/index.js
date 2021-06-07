const express = require("express");
const router = express.Router();

const proveRoutes = require("./proveRoutes");
const project1Routes = require("./project1Routes");
const teamRoutes = require("./teamRoutes");
const classRoutes = require("./classRoutes");

router
  .use("/project1", project1Routes)
  .use("/prove", proveRoutes)
  .use("/team", teamRoutes)
  .use("/class", classRoutes);

module.exports = router;
