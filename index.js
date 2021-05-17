// Our initial setup (package requires, port number setup)
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000

const app = express();

// Route setup. You can implement more in the future!
const routes = require("./routes");

const errorController = require("./controllers/errors");

app
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .use(express.urlencoded({ extended: false })) // For parsing the body of a POST
  .use(routes)
  .get("/", (req, res, next) => {
    // This is the primary index, always handled last.
    res.render("pages/index", {
      title: "Welcome to my CSE341 repo",
      path: "/",
    });
  })
  .use(errorController.get404)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
