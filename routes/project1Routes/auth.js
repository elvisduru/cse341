const express = require("express");
const router = express.Router();

const authController = require("../../controllers/project1Controllers/auth");

router
  .get("/login", authController.getLogin)
  .get("/signup", authController.getSignup)
  .post("/login", authController.postLogin)
  .post("/signup", authController.postSignup)
  .post("/logout", authController.postLogout);
module.exports = router;
