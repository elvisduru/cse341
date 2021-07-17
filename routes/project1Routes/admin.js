const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const adminController = require("../../controllers/project1Controllers/admin");

router
  .get("/products/new", adminController.getAddProduct)
  .get("/products", adminController.getProducts)
  .post(
    "/products",
    [
      body("name").isLength({ min: 3 }).trim(),
      body("imageUrl").isURL(),
      body("price").isFloat(),
      body("description").isLength({ min: 5, max: 400 }).trim(),
      body("tags").isString().trim(),
    ],
    adminController.postProduct
  )
  .get("/products/:id/edit", adminController.getEditProduct)
  .get("/products/:id", adminController.getProduct)
  .put(
    "/products/:id",
    [
      body("name").isLength({ min: 3 }).trim(),
      body("imageUrl").isURL(),
      body("price").isFloat(),
      body("description").isLength({ min: 5, max: 400 }).trim(),
      body("tags").isString().trim(),
    ],
    adminController.updateProduct
  )
  .delete("/products/:id", adminController.deleteProduct);

module.exports = router;
