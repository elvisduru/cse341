const express = require("express");
const router = express.Router();

const users = ["admin"]; // Dummy array for users

router.get("/", (req, res, next) => {
  res.render("proveViews/prove12/pages/pr12-login", {
    title: "Prove Activity 12",
    path: "proveViews/prove12",
    csrfToken: req.csrfToken(),
  });
});

// Verify login submission to access chat room.
router.post("/login", (req, res, next) => {
  if (!req.body.username) {
    return res.status(400).send({ error: "Username is required." });
  }
  const username = req.body.username.trim();
  if (users.includes(username)) {
    return res.status(409).send({ error: "Username is taken!" });
  }

  users.push(username);
  req.session.user = username;
  res.status(200).send({ username, success: "Welcome to the chat room!" });
});

// Render chat screen.
router.get("/chat", (req, res, next) => {
  /***********************************
   *         YOUR CODE HERE          *
   ***********************************/
  res.render("proveViews/prove12/pages/pr12-chat", {
    title: "Prove Activity 12",
    path: "/prove/prove12",
    user: req.session.user,
  });
});

module.exports = router;
