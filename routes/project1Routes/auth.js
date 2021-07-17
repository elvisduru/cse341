const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");
const { getDatabase } = require("../../util/db");
const authController = require("../../controllers/project1Controllers/auth");

router
  .get("/login", authController.getLogin)
  .get("/signup", authController.getSignup)
  .get("/forgot-password", authController.getForgetPassword)
  .get("/reset/:token", authController.getReset)
  .post("/reset", authController.postReset)
  .post("/forgot-password", authController.postForgetPassword)
  .post(
    "/login",
    [
      check("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),
      body("password", "Password is not valid")
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
    ],
    authController.postLogin
  )
  .post(
    "/signup",
    [
      check("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .custom((value, { req }) => {
          return getDatabase()
            .then((db) => db.Project1User.findOne({ email: value }))
            .then((userDoc) => {
              if (userDoc) {
                return Promise.reject(
                  "Email exists already. Please use a different one."
                );
              }
            });
        })
        .normalizeEmail(),
      body(
        "password",
        "Please enter a password that contains at least a number and is more than 5 characters"
      )
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
      body("confirmPassword")
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error("Passwords have to match!");
          }
          return true;
        })
        .trim(),
    ],
    authController.postSignup
  )
  .post("/logout", authController.postLogout);
module.exports = router;
