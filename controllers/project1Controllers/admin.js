const { validationResult } = require("express-validator");
const { getDatabase } = require("../../util/db");

exports.getAddProduct = async (req, res, next) => {
  try {
    res.render("project1Views/pages/admin/edit-product", {
      pageTitle: "Add Product",
      path: "/project1/admin/products/new",
      editing: false,
      errorMessage: [],
      hasError: false,
      validationErrors: [],
    });
  } catch (error) {
    error = new Error(error);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postProduct = async (req, res, next) => {
  try {
    // Split tags string input into array
    req.body.tags = req.body.tags.split(",");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("project1Views/pages/admin/edit-product", {
        pageTitle: "Add Product",
        path: "/project1/admin/products/new",
        editing: false,
        hasError: true,
        product: req.body,
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    const db = await getDatabase();
    const product = new db.Project1Product({ ...req.body, userId: req.user });
    await product.save();
    console.log("Created Product");
    res.redirect("/project1/admin/products");
  } catch (error) {
    error = new Error(error);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const db = await getDatabase();
    const products = await db.Project1Product.find({
      userId: req.user._id,
    }).sort({ updatedAt: -1 });

    res.render("project1Views/pages/admin", {
      pageTitle: "All Products | Laptop Shop :: Admin",
      path: "/project1/admin/products",
      products,
    });
  } catch (error) {
    error = new Error(error);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const prodId = req.params.id;
    const db = await getDatabase();
    const product = await db.Project1Product.findById(prodId);

    res.render("project1Views/pages/shop/product-details", {
      pageTitle: `${product.name} | Laptop Shop :: Admin`,
      path: "/project1/admin/products",
      product,
    });
  } catch (error) {
    error = new Error(error);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const prodId = req.params.id;
    const db = await getDatabase();
    await db.Project1Product.deleteOne({ _id: prodId, userId: req.user._id });
    console.log("DESTROYED PRODUCT");
    res.redirect("/project1/admin/products");
  } catch (error) {
    error = new Error(error);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const prodId = req.params.id;
    const db = await getDatabase();
    const product = await db.Project1Product.findById(prodId);
    if (!product) {
      return res.redirect("/project1/admin/products");
    }
    res.render("project1Views/pages/admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/project1/admin/products",
      editing: true,
      product: product,
      _id: prodId,
      hasError: false,
      errorMessage: [],
      validationErrors: [],
    });
  } catch (error) {
    error = new Error(error);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    // Split tags string input into array
    req.body.tags = req.body.tags.split(",");
    const prodId = req.params.id;
    req.body._id = prodId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("project1Views/pages/admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/project1/admin/products",
        editing: true,
        hasError: true,
        product: req.body,
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array(),
      });
    }

    const db = await getDatabase();
    const product = await db.Project1Product.findById(prodId);
    // Redirect to products route if no product found
    if (!product || product.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/project1/admin/products");
    }

    // Update product
    product.name = req.body.name;
    product.imageUrl = req.body.imageUrl;
    product.price = req.body.price;
    product.description = req.body.description;
    product.tags = req.body.tags;

    // save product
    await product.save();

    console.log("UPDATED PRODUCT!");
    res.redirect("/project1/admin/products");
  } catch (error) {
    error = new Error(error);
    error.httpStatusCode = 500;
    return next(error);
  }
};
