const express = require("express");

const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  const products = adminData.products;
  res.render("classViews/pages/shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/class",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
});

module.exports = router;
