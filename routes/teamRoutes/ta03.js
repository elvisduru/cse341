const express = require("express");
const router = express.Router();
const axios = require("axios");

let ALL_PRODUCTS = [];

router.get("/", async (req, res, next) => {
  const BASE_URL = "https://byui-cse.github.io/cse341-course/lesson03";
  const items = "items.json";

  try {
    const { data } = await axios.get(`${BASE_URL}/${items}`);
    ALL_PRODUCTS = data;
  } catch (error) {
    ALL_PRODUCTS = [];
    throw new Error("Something went wrong");
  }

  res.render("teamViews/pages/ta03", {
    title: "Team Activity 03",
    path: "/team/ta03",
    totalProducts: ALL_PRODUCTS.length,
    products: ALL_PRODUCTS,
  });
});

router.post("/", async (req, res, next) => {
  const { search } = req.body;

  if (!search) {
    res.redirect("/ta03");
  }

  const filteredProducts = ALL_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  res.render("teamViews/pages/ta03", {
    title: "Team Activity 03",
    path: "/team/ta03",
    totalProducts: ALL_PRODUCTS.length,
    products: filteredProducts,
  });
});

module.exports = router;
