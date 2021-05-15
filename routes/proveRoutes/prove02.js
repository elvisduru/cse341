//TA03 PLACEHOLDER
const express = require("express");
const router = express.Router();

const books = [];

router.post("/add", (req, res, next) => {
  const { title, image, summary } = req.body;
  books.push({ title, image, summary });
  res.redirect("/books");
});

router.get("/books", (req, res, next) => {
  res.render("proveViews/prove02/pages/books", {
    title: "My Book Collection",
    path: "/books",
    books: books,
  });
});

router.get("/", (req, res, next) => {
  res.render("proveViews/prove02/pages", {
    title: "Welcome to your book collection",
    path: "/",
  });
});

module.exports = router;
