const express = require("express");
const router = express.Router();

const prove02Routes = require("./prove02");

router.use("/prove02", prove02Routes);

module.exports = router;
