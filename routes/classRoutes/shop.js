const express = require("express");

const shopController = require("../../controllers/classControllers/shop");

const router = express.Router();

router
  .get("/", shopController.getIndex)
  .get("/products", shopController.getProducts)
  .get("/products/:productId", shopController.getProduct)
  .get("/cart", shopController.getCart)
  .post("/cart", shopController.postCart)
  .post("/cart-delete-item", shopController.postCartDeleteProduct)
  .get("/orders", shopController.getOrders)
  .get("/checkout", shopController.getCheckout);

module.exports = router;
