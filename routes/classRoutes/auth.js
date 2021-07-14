const express = require("express");

const authController = require("../../controllers/classControllers/auth");

const router = express.Router();

router
  .get("/login", authController.getLogin)
  .get("/signup", authController.getSignup)
  .post("/login", authController.postLogin)
  .post("/signup", authController.postSignup)
  .post("/logout", authController.postLogout);

module.exports = router;
