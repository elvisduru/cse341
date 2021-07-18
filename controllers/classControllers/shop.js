const { getDatabase } = require("../../util/db");

exports.getProducts = async (req, res, next) => {
  const page = +req.query.page || 1;
  const limit = 1;
  const skip = (page - 1) * limit;
  let totalItems;
  getDatabase()
    .then((db) => db.ClassProduct.find().countDocuments())
    .then((numProducts) => {
      totalItems = numProducts;
      return getDatabase().then((db) =>
        db.ClassProduct.find().skip(skip).limit(limit)
      );
    })
    .then((products) => {
      res.render("classViews/pages/shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/class/products",
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

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  getDatabase()
    .then((db) => db.ClassProduct.findById(prodId))
    .then((product) => {
      res.render("classViews/pages/shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/class/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = async (req, res, next) => {
  const page = +req.query.page || 1;
  const limit = 1;
  const skip = (page - 1) * limit;
  let totalItems;
  getDatabase()
    .then((db) => db.ClassProduct.find().countDocuments())
    .then((numProducts) => {
      totalItems = numProducts;
      return getDatabase().then((db) =>
        db.ClassProduct.find().skip(skip).limit(limit)
      );
    })
    .then((products) => {
      res.render("classViews/pages/shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/class",
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

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render("classViews/pages/shop/cart", {
        path: "/class/cart",
        pageTitle: "Your Cart",
        products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  getDatabase()
    .then((db) => db.ClassProduct.findById(prodId))
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/class/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/class/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => ({
        quantity: i.quantity,
        product: { ...i.productId._doc },
      }));
      getDatabase().then((db) => {
        const order = new db.ClassOrder({
          user: {
            email: req.user.email,
            userId: req.user,
          },
          products,
        });
        return order.save();
      });
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/class/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  getDatabase()
    .then((db) => db.ClassOrder.find())
    .then((orders) => {
      res.render("classViews/pages/shop/orders", {
        path: "/class/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
