const path = require("path");
const fs = require("fs");

const p = path.join(
  path.dirname(require.main.filename),
  "data/prove03",
  "products.json"
);

exports.getProducts = (req, res, next) => {
  let products;
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      products = [];
    } else {
      products = JSON.parse(fileContent);
      res.render("proveViews/prove03/pages/shop", {
        pageTitle: "Home | Laptop Shop",
        path: "/prove/prove03",
        products,
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
