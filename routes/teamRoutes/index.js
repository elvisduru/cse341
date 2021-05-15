const express = require("express");
const router = express.Router();

const ta01Routes = require("./ta01");
const ta02Routes = require("./ta02");
const ta03Routes = require("./ta03");
const ta04Routes = require("./ta04");

router
  .use("/ta01", ta01Routes)
  .use("/ta02", ta02Routes)
  .use("/ta03", ta03Routes)
  .use("/ta04", ta04Routes);

module.exports = router;
