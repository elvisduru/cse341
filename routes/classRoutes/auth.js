const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../../controllers/classControllers/auth");
const { getDatabase } = require("../../util/db");

const router = express.Router();

router
  .get("/login", authController.getLogin)
  .get("/signup", authController.getSignup)
  .get("/reset", authController.getReset)
  .get("/reset/:token", authController.getNewPassword)
  .post("/reset", authController.postReset)
  .post("/new-password", authController.postNewPassword)
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
          // if (value === "test@test.com") {
          //   throw new Error("This email address is forbidden");
          // }
          // return true;
          return getDatabase()
            .then((db) => db.ClassUser.findOne({ email: value }))
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
        "Please enter a password with only numbers and text and at least 5 characters"
      )
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
      body("confirmPassword")
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error("Passwords have to match");
          }
          return true;
        })
        .trim(),
    ],
    authController.postSignup
  )
  .post("/logout", authController.postLogout);

module.exports = router;
