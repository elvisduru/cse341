// Our initial setup (package requires, port number setup)
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000

const app = express();

// Route setup. You can implement more in the future!
const routes = require("./routes");

const errorController = require("./controllers/errors");

const mongoose = require("mongoose");
const User = require("./models/classModels/user");

app
  .use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .use(express.urlencoded({ extended: false })) // For parsing the body of a POST
  .use((req, res, next) => {
    User.findById("60ba6c7b1d7d09083090e418")
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => console.log(err));
  })
  .use(routes)
  .get("/", (req, res, next) => {
    // This is the primary index, always handled last.
    res.render("pages/index", {
      title: "Welcome to my CSE341 repo",
      path: "/",
    });
  })
  .use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://elvisduru:victory1.@cse341-class.8upk6.mongodb.net/class",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Max",
          email: "max@test.com",
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
