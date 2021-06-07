const express = require("express");
const router = express.Router();

const shopController = require("../../controllers/project1Controllers/shop");

router
  .get("/", shopController.getProducts)
  .get("/products", shopController.getProducts)
  .get("/cart", shopController.getCart)
  .post("/cart/:id", shopController.postCart)
  .delete("/cart/:id", shopController.deleteCartItem)
  .get("/products/:productId", shopController.getProduct)
  .get("/orders", shopController.getOrders)
  .post("/orders", shopController.postOrder);

module.exports = router;
