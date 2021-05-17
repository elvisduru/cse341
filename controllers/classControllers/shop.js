const Product = require("../../models/classModels/product");
const Cart = require("../../models/classModels/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("classViews/pages/shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/class/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    res.render("classViews/pages/shop/product-detail", {
      product,
      pageTitle: "Product Details",
      path: "/class/products",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("classViews/pages/shop", {
      prods: products,
      pageTitle: "Shop",
      path: "/class",
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (const product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("classViews/pages/shop/cart", {
        path: "/class/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/class/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/class/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("classViews/pages/shop/orders", {
    path: "/class/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("classViews/pages/shop/checkout", {
    path: "/class/checkout",
    pageTitle: "Checkout",
  });
};
