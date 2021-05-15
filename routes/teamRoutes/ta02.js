//TA02 PLACEHOLDER
// Remember, you can make more of these placeholders yourself!
const express = require("express");
const router = express.Router();

const list = [];

router.use("/adduser", (req, res, next) => {
  const name = req.body.name;
  list.push(name);
  res.redirect("/team/ta02/");
});

router.post("/removeUser", (req, res, next) => {
  const removeName = req.body.removeName;
  const index = list.indexOf(removeName);
  if (index !== -1) {
    list.splice(index, 1);
  }

  res.redirect("/team/ta02/");
});
router.get("/", (req, res, next) => {
  res.render("teamViews/pages/ta02", {
    title: "Team Activity 02",
    names: list,
    path: "/team/ta02", // For pug, EJS
    activeTA03: true, // For HBS
    contentCSS: true, // For HBS
  });
});

module.exports = router;
