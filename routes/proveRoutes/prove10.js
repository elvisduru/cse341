const express = require("express");
const router = express.Router();

// Path to your JSON file, although it can be hardcoded in this file.
const dummyData = require("../../data/prove10-data.json");

router.get("/", (req, res, next) => {
  res.render("proveViews/prove10", {
    title: "Prove 10",
    path: "/prove/prove10",
    csrfToken: req.csrfToken(),
  });
});

router.get("/fetchAll", (req, res, next) => {
  res.json(dummyData);
});

router.post("/insert", (req, res, next) => {
  if (req.body.newName) {
    const newName = req.body.newName;

    if (!dummyData.avengers.some((a) => a.name === newName)) {
      dummyData.avengers.push({ name: newName });
      res.sendStatus(200);
    }
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
