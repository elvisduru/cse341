const express = require("express");
const router = express.Router();

const shopController = require("../../../controllers/proveControllers/prove08/shop");

router
  .get("/", shopController.getProducts)
  .get("/shop/:productId", shopController.getProduct);

module.exports = router;
