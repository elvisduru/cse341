const { getDatabase } = require("../../util/db");

exports.getProducts = async (req, res, next) => {
  getDatabase()
    .then((db) => {
      return db.ClassProduct.find();
      // .select("title price -_id")
      // .populate("userId", "name")
    })
    .then((products) => {
      res.render("classViews/pages/shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/class/products",
      });
    })
    .catch((err) => {
      console.log(err);
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
    .catch((err) => console.log(err));
};

exports.getIndex = async (req, res, next) => {
  getDatabase()
    .then((db) => db.ClassProduct.find())
    .then((products) => {
      res.render("classViews/pages/shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/class",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  console.log(req.user);
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
    .catch((err) => console.log(err));
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
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/class/cart");
    })
    .catch((err) => console.log(err));
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
    .catch((err) => console.log(err));
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
    .catch((err) => console.log(err));
};
