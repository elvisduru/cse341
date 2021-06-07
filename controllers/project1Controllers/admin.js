const { getDatabase } = require("../../util/db");

exports.getAddProduct = async (req, res, next) => {
  try {
    res.render("project1Views/pages/admin/edit-product", {
      pageTitle: "Add Product",
      path: "/project1/admin/products/new",
      editing: false,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postProduct = async (req, res, next) => {
  try {
    if (
      !req.body.name ||
      !req.body.imageUrl ||
      !req.body.price ||
      !req.body.description ||
      !req.body.tags
    ) {
      throw "Something is missing from your input";
    }
    // Split tags string input into array
    req.body.tags = req.body.tags.split(",");

    const db = await getDatabase();
    const product = new db.Project1Product(req.body);
    await product.save();
    console.log("Created Product");
    res.redirect("/project1/admin/products");
  } catch (error) {
    console.log(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const db = await getDatabase();
    const products = await db.Project1Product.find().sort({ updatedAt: -1 });

    res.render("project1Views/pages/admin", {
      pageTitle: "All Products | Laptop Shop :: Admin",
      path: "/project1/admin/products",
      products,
    });
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const prodId = req.params.id;
    const db = await getDatabase();
    await db.Project1Product.findByIdAndRemove(prodId);
    console.log("DESTROYED PRODUCT");
    res.redirect("/project1/admin/products");
  } catch (error) {
    console.log(error);
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
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    if (
      !req.body.name ||
      !req.body.imageUrl ||
      !req.body.price ||
      !req.body.description ||
      !req.body.tags
    ) {
      throw "Something is missing from your input";
    }
    // Split tags string input into array
    req.body.tags = req.body.tags.split(",");
    const prodId = req.params.id;
    const db = await getDatabase();
    const product = await db.Project1Product.findById(prodId);

    // Redirect to products route if no product found
    if (!product) {
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
    console.log(error);
  }
};
