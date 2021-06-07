// Our initial setup (package requires, port number setup)
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000

const app = express();
const methodOverride = require("method-override");

// Route setup. You can implement more in the future!
const routes = require("./routes");

const errorController = require("./controllers/errors");

const { getDatabase } = require("./util/db");

app
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .use(methodOverride("_method"))
  .use(express.urlencoded({ extended: false })) // For parsing the body of a POST
  // .use((req, res, next) => {
  //   User.findById("60bcceefb6569a0c66376345")
  //     .then((user) => {
  //       req.user = user;
  //       next();
  //     })
  //     .catch((err) => console.log(err));
  // })
  .use(routes)
  .get("/", (req, res, next) => {
    // This is the primary index, always handled last.
    res.render("pages/index", {
      title: "Welcome to my CSE341 repo",
      path: "/",
    });
  })
  .use(errorController.get404);

getDatabase()
  .then((db) => {
    db.ClassUser.findOne().then((user) => {
      if (!user) {
        const user = new db.ClassUser({
          name: "Elvis",
          email: "elvis@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    return db;
  })
  .then((db) => {
    db.Project1User.findOne().then((user) => {
      if (!user) {
        const user = new db.Project1User({
          name: "Elvis",
          email: "elvis@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
  })
  .catch((err) => console.log(err));
