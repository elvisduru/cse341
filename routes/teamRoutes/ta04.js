//TA04 PLACEHOLDER
const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("teamViews/pages/ta04", {
    title: "Team Activity 04",
    path: "/team/ta04", // For pug, EJS
    activeTA04: true, // For HBS
    contentCSS: true, // For HBS
  });
});

module.exports = router;
