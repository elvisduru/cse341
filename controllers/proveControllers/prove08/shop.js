const path = require("path");
const fs = require("fs");

const p = path.join(
  path.dirname(require.main.filename),
  "data/prove03",
  "products.json"
);

const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
  let page = +req.query.page || 1;
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = page * ITEMS_PER_PAGE;
  let products;
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      products = [];
    } else {
      products = JSON.parse(fileContent);
      res.render("proveViews/prove08/pages/shop", {
        pageTitle: "Home | Laptop Shop",
        path: "/prove/prove03",
        products: products.slice(start, end),
        hasNextPage: products.length > end,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        currentPage: page,
        totalProducts: products.length,
        lastPage: Math.ceil(products.length / ITEMS_PER_PAGE),
      });
    }
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      products = [];
    } else {
      products = JSON.parse(fileContent);
      const product = products.find((prod) => prod.id === prodId);
      res.render("proveViews/prove03/pages/shop/product-details", {
        pageTitle: `Laptop Shop | ${product.name}`,
        path: "/prove/prove03",
        product,
      });
    }
  });
};
