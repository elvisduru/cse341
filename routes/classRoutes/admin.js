const express = require("express");
const { body } = require("express-validator");

const adminController = require("../../controllers/classControllers/admin");

const router = express.Router();

router
  .get("/add-product", adminController.getAddProduct)
  .post(
    "/add-product",
    [
      body("title").isLength({ min: 3 }).trim(),
      body("imageUrl").isURL(),
      body("price").isFloat(),
      body("description").isLength({ min: 5, max: 400 }).trim(),
    ],
    adminController.postAddProduct
  )
  .get("/edit-product/:productId", adminController.getEditProduct)
  .post(
    "/edit-product",
    [
      body("title").isLength({ min: 3 }).trim(),
      body("imageUrl").isURL(),
      body("price").isFloat(),
      body("description").isLength({ min: 5, max: 400 }).trim(),
    ],
    adminController.postEditProduct
  )
  .post("/delete-product", adminController.postDeleteProduct)
  .get("/products", adminController.getProducts);

module.exports = router;
