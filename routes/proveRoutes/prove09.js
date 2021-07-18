//TA03 PLACEHOLDER
const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.render("proveViews/prove09", {
    title: "Pokemon | Prove09",
    path: "prove/prove09",
  });
});

module.exports = router;
