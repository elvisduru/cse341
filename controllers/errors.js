exports.get404 = (req, res, next) => {
  // 404 page
  res.render("pages/404", { title: "404 - Page Not Found", path: req.url });
};
exports.get500 = (req, res, next) => {
  // 500 page
  res.render("pages/500", { title: "500 - System Error", path: req.url });
};
