const { createConnections } = require("./createConnections");
const ClassUserSchema = require("../models/classModels/user");
const ClassProductSchema = require("../models/classModels/product");
const ClassOrderSchema = require("../models/classModels/order");

const Project1UserSchema = require("../models/project1Models/user");
const Project1ProductSchema = require("../models/project1Models/product");
const Project1OrderSchema = require("../models/project1Models/order");

const url1 =
  "mongodb+srv://elvisduru:victory1.@cse341-class.8upk6.mongodb.net/class";
const url2 =
  "mongodb+srv://elvisduru:victory1.@cse341-class.8upk6.mongodb.net/project1";

const options = { useNewUrlParser: true, useUnifiedTopology: true };

let db;

exports.getDatabase = function () {
  if (db) return Promise.resolve(db);
  return createDatabases();
};

const createDatabases = async () => {
  try {
    const { db1, db2 } = await createConnections(url1, url2, options);
    const ClassUser = db1.model("User", ClassUserSchema);
    const ClassProduct = db1.model("Product", ClassProductSchema);
    const ClassOrder = db1.model("Order", ClassOrderSchema);

    const Project1User = db2.model("User", Project1UserSchema);
    const Project1Product = db2.model("Product", Project1ProductSchema);
    const Project1Order = db2.model("Order", Project1OrderSchema);
    db = {
      ClassUser,
      ClassProduct,
      ClassOrder,
      Project1User,
      Project1Product,
      Project1Order,
      connections: {
        db1,
        db2,
      },
    };
    return db;
  } catch (error) {
    console.log(error);
  }
};
