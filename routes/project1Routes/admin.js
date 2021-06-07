const express = require("express");
const router = express.Router();

const adminController = require("../../controllers/project1Controllers/admin");

router
  .get("/products/new", adminController.getAddProduct)
  .get("/products", adminController.getProducts)
  .post("/products", adminController.postProduct)
  .get("/products/:id/edit", adminController.getEditProduct)
  .get("/products/:id", adminController.getProduct)
  .put("/products/:id", adminController.updateProduct)
  .delete("/products/:id", adminController.deleteProduct);

module.exports = router;
