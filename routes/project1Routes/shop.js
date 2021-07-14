const express = require("express");
const router = express.Router();

const isAuth = require("../../middleware/project/is-auth");

const shopController = require("../../controllers/project1Controllers/shop");

router
  .get("/", shopController.getProducts)
  .get("/products", shopController.getProducts)
  .get("/products/:productId", shopController.getProduct)
  .get("/cart", isAuth, shopController.getCart)
  .post("/cart/:id", isAuth, shopController.postCart)
  .delete("/cart/:id", isAuth, shopController.deleteCartItem)
  .get("/orders", isAuth, shopController.getOrders)
  .post("/orders", isAuth, shopController.postOrder);

module.exports = router;
