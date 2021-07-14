module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/project1/login");
  }
  next();
};
