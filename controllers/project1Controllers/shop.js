const { getDatabase } = require("../../util/db");
exports.getProducts = async (req, res, next) => {
  try {
    const db = await getDatabase();
    const products = await db.Project1Product.find();

    res.render("project1Views/pages/shop", {
      pageTitle: "All Products | Laptop Shop",
      path: "/project1/products",
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
    const prodId = req.params.productId;
    const db = await getDatabase();
    const product = await db.Project1Product.findById(prodId);

    res.render("project1Views/pages/shop/product-details", {
      pageTitle: `${product.name} | Laptop Shop`,
      path: "/project1",
      product,
    });
  } catch (error) {
    error = new Error(error);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId").execPopulate();
    const products = user.cart.items;
    res.render("project1Views/pages/shop/cart", {
      path: "/project1/cart",
      pageTitle: "Your Cart",
      products,
    });
  } catch (error) {
    error = new Error(error);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const prodId = req.params.id;
    const db = await getDatabase();
    const product = await db.Project1Product.findById(prodId);
    await req.user.addToCart(product);
    res.redirect("/project1/cart");
  } catch (error) {
    error = new Error(error);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.deleteCartItem = async (req, res, next) => {
  try {
    const prodId = req.params.id;
    await req.user.removeFromCart(prodId);
    res.redirect("/project1/cart");
  } catch (error) {
    error = new Error(error);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const db = await getDatabase();
    const orders = await db.Project1Order.find();

    res.render("project1Views/pages/shop/orders", {
      path: "/project1/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  } catch (error) {
    error = new Error(error);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId").execPopulate();
    const products = user.cart.items.map((i) => ({
      quantity: i.quantity,
      product: { ...i.productId._doc },
    }));
    const db = await getDatabase();
    const order = new db.Project1Order({
      user: {
        email: req.user.email,
        userId: req.user,
      },
      products,
    });
    await order.save();
    await req.user.clearCart();
    res.redirect("/project1/orders");
  } catch (error) {
    error = new Error(error);
    error.httpStatusCode = 500;
    return next(error);
  }
};
