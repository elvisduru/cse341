//TA03 PLACEHOLDER
const express = require("express");
const router = express.Router();

const books = [];

router.post("/add", (req, res, next) => {
  const { title, image, summary } = req.body;
  books.push({ title, image, summary });
  res.redirect("/books");
});

router.get("/", (req, res, next) => {
  res.render("pages/books", {
    title: "My Book Collection",
    path: "/books",
    books: books,
  });
});

module.exports = router;
