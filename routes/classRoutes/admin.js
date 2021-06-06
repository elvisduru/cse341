const express = require("express");

const adminController = require("../../controllers/classControllers/admin");

const router = express.Router();

router
  .get("/add-product", adminController.getAddProduct)
  .post("/add-product", adminController.postAddProduct)
  .get("/edit-product/:productId", adminController.getEditProduct)
  .post("/edit-product", adminController.postEditProduct)
  .post("/delete-product", adminController.postDeleteProduct)
  .get("/products", adminController.getProducts);

module.exports = router;
