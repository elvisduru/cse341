// Our initial setup (package requires, port number setup)
require("dotenv").config();
const express = require("express");
const path = require("path");
const csrf = require("csurf");
const flash = require("connect-flash");
const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000
const MONGODB_URI = process.env.DB_SESSION;
const app = express();
const methodOverride = require("method-override");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

// Route setup. You can implement more in the future!
const routes = require("./routes");

const errorController = require("./controllers/errors");

app
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .use(methodOverride("_method"))
  .use(express.urlencoded({ extended: false })) // For parsing the body of a POST
  .use(
    session({
      secret: "my secret",
      resave: false,
      saveUninitialized: false,
      store,
    })
  )
  .use(csrfProtection)
  .use(flash())
  .use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  })
  .use(routes)
  .get("/", (req, res, next) => {
    // This is the primary index, always handled last.
    res.render("pages/index", {
      title: "Welcome to my CSE341 repo",
      path: "/",
    });
  })
  .get("/500", errorController.get500)
  .use(errorController.get404)
  .use((err, req, res, next) => {
    res
      .status(500)
      .render("pages/500", { title: "500 - System Error", path: req.url });
  })
  .listen(PORT, () => console.log(`Listening on port: ${PORT}`));
