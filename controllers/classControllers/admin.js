const { getDatabase } = require("../../util/db");

exports.getAddProduct = (req, res, next) => {
  res.render("classViews/pages/admin/edit-product", {
    pageTitle: "Add Product",
    path: "/class/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  getDatabase()
    .then((db) => {
      const product = new db.ClassProduct({
        title,
        price,
        description,
        imageUrl,
        userId: req.user,
      });
      return product.save();
    })
    .then((result) => {
      console.log("Created Product");
      res.redirect("/class/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/class/");
  }
  const prodId = req.params.productId;
  getDatabase()
    .then((db) => db.ClassProduct.findById(prodId))
    .then((product) => {
      if (!product) {
        return res.redirect("/class/");
      }
      res.render("classViews/pages/admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/class/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  getDatabase()
    .then((db) => db.ClassProduct.findById(prodId))
    .then((product) => {
      (product.title = updatedTitle),
        (product.price = updatedPrice),
        (product.description = updatedDesc),
        (product.imageUrl = updatedImageUrl);
      return product.save();
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/class/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  getDatabase()
    .then((db) => db.ClassProduct.find())
    .then((products) => {
      res.render("classViews/pages/admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/class/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  getDatabase()
    .then((db) => db.ClassProduct.findByIdAndRemove(prodId))
    .then(() => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/class/admin/products");
    })
    .catch((err) => console.log(err));
};
