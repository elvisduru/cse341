const express = require("express");
const router = express.Router();

const prove02Routes = require("./prove02");
const prove03Routes = require("./prove03");

router.use("/prove02", prove02Routes).use("/prove03", prove03Routes);

module.exports = router;
