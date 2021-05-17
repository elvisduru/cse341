const Product = require("../../models/classModels/product");
const Cart = require("../../models/classModels/cart");

exports.getAddProduct = (req, res, next) => {
  res.render("classViews/pages/admin/edit-product", {
    pageTitle: "Add Product",
    path: "/class/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect("/class/admin/products");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
  }
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect("/class");
    }
    res.render("classViews/pages/admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/class/admin/edit-product",
      editing: editMode,
      product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  const updatedProduct = new Product(
    productId,
    title,
    imageUrl,
    description,
    price
  );
  updatedProduct.save();
  res.redirect("/class/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect("/class/admin/products");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("classViews/pages/admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/class/admin/products",
    });
  });
};
