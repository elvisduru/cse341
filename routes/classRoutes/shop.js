const express = require("express");

const shopController = require("../../controllers/classControllers/shop");
const isAuth = require("../../middleware/class/is-auth");

const router = express.Router();

router
  .get("/", shopController.getIndex)
  .get("/products", shopController.getProducts)
  .get("/products/:productId", shopController.getProduct)
  .get("/cart", isAuth, shopController.getCart)
  .post("/cart", isAuth, shopController.postCart)
  .post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct)
  .post("/create-order", isAuth, shopController.postOrder)
  .get("/orders", isAuth, shopController.getOrders);
// .get("/checkout", shopController.getCheckout);

module.exports = router;
