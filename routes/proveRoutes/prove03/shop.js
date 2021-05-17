const express = require("express");
const router = express.Router();

const shopController = require("../../../controllers/proveControllers/prove03/shop");

router
  .get("/", shopController.getProducts)
  .get("/shop/:productId", shopController.getProduct);

module.exports = router;
