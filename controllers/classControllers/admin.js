const { getDatabase } = require("../../util/db");
const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {
  res.render("classViews/pages/admin/edit-product", {
    pageTitle: "Add Product",
    path: "/class/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: [],
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("classViews/pages/admin/edit-product", {
      pageTitle: "Add Product",
      path: "/class/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title,
        imageUrl,
        price,
        description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
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
    .then(() => {
      console.log("Created Product");
      res.redirect("/class/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
        hasError: false,
        errorMessage: [],
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("classViews/pages/admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/class/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  getDatabase()
    .then((db) => db.ClassProduct.findById(prodId))
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/class/admin/products");
      }
      (product.title = updatedTitle),
        (product.price = updatedPrice),
        (product.description = updatedDesc),
        (product.imageUrl = updatedImageUrl);
      return product.save().then((result) => {
        console.log("UPDATED PRODUCT!");
        res.redirect("/class/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  const limit = 1;
  const skip = (page - 1) * limit;
  let totalItems;
  getDatabase()
    .then((db) =>
      db.ClassProduct.find({ userId: req.user._id }).countDocuments()
    )
    .then((numProducts) => {
      totalItems = numProducts;
      return getDatabase().then((db) =>
        db.ClassProduct.find({ userId: req.user._id }).skip(skip).limit(limit)
      );
    })
    .then((products) => {
      res.render("classViews/pages/admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/class/admin/products",
        totalProducts: totalItems,
        currentPage: page,
        hasNextPage: totalItems > page * limit,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / limit),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  getDatabase()
    .then((db) =>
      db.ClassProduct.deleteOne({ _id: prodId, userId: req.user._id })
    )
    .then(() => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/class/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
