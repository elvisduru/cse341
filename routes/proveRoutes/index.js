const express = require("express");
const router = express.Router();

const prove02Routes = require("./prove02");
const prove03Routes = require("./prove03");
const prove08Routes = require("./prove08");
const prove09Routes = require("./prove09");
const prove10Routes = require("./prove10");
const prove11Routes = require("./prove11");
const prove12Routes = require("./prove12/liveChat");

router
  .use("/prove02", prove02Routes)
  .use("/prove03", prove03Routes)
  .use("/prove08", prove08Routes)
  .use("/prove09", prove09Routes)
  .use("/prove10", prove10Routes)
  .use("/prove11", prove11Routes)
  .use("/prove12", prove12Routes);

module.exports = router;
