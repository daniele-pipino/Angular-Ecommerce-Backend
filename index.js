//?   IMPORT PACKAGES
const { MongoClient } = require("mongodb");
const express = require("express");
const body = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const { request } = require("express");
// if i want to use the id i need this import
const ObjectId = require("mongodb").ObjectId;

//?      RUN THE APP
const app = express();

// say to use package
app.use(body.json());
app.use(cors());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//data

const dbUrl = "mongodb://localhost:27017/users";

const mongoClient = new MongoClient(dbUrl);

let rifDB;
let categoriesCollection;
let productsCollection;
let usersCollection;

//todo             SERVER STARTING
async function run() {
  await mongoClient.connect();

  console.log("Server avviato correttamente...");

  app.listen(3000, () => {
    console.log("Server in ascolto sulla porta 3000");
  });

  rifDB = mongoClient.db("ecommerce");
  categoriesCollection = rifDB.collection("categories");
  productsCollection = rifDB.collection("products");
  usersCollection = rifDB.collection("users");
}

run();

//todo                                 CRUD

//register
app.post("/new/user", async (req, res) => {
  const user = req.body;
  console.log(user);

  const ris = await usersCollection.insertOne(user);

  res.send({
    message: "Utente inserito",
  });
});

//todo                   PRODUCTS

// products
app.get("/products", async (req, res) => {
  const ris = await productsCollection.find({});

  let products = [];

  await ris.forEach((element) => {
    products.push(element);
  });

  res.send({ result: products });
});

//creating product
app.post("/new/product", async (req, res) => {
  console.log("entro nella creazione del prodotto");
  const product = req.body;
  console.log(product);

  const ris = await productsCollection.insertOne(product);

  res.send({
    message: "Prodotto inserito",
  });
});

//find product
app.get("/find/:id", async (req, res) => {
  const productsId = new ObjectId(req.params.id);
  console.log(productsId);
  const ris = await productsCollection.findOne({ _id: productsId });
  res.send({ result: ris });
});

//modify product
app.put("/modify/product/:id", async (req, res) => {
  console.log("entro nella funzioen di modifica");
  const productsId = new ObjectId(req.params._id);

  //filter
  let filter = { _id: productsId };
  console.log(filter);

  //data
  const update = req.body;

  //updating
  const data = {
    //comando per modificare i dati
    $set: update,
  };

  console.log("oggetto finale", data);

  const ris = await productsCollection.updateOne(filter, data);
  console.log(ris);

  res.send({
    message: `Prodotto modificato con successo`,
    result: ris,
  });
});

//deleting product
app.delete("/delete/product/:id", async (req, res) => {
  // take the products id
  let productsId = new ObjectId(req.params.id);
  console.log(productsId);

  //create an object to pass in delte method
  const filter = { _id: productsId };

  //dlete the products
  const ris = await productsCollection.deleteOne(filter);

  //send response
  res.send({
    res: ris,
  });
});

//todo            CATEGORIES

//categories
app.get("/categories", async (req, res) => {
  const ris = await categoriesCollection.find({});

  let categories = [];

  await ris.forEach((element) => {
    categories.push(element);
  });

  res.send({ result: categories });
});

//new category
app.post("/new/category", async (req, res) => {
  console.log("entro nella creazione del prodotto");
  const category = req.body;
  console.log(category);

  const ris = await categoriesCollection.insertOne(category);

  res.send({
    message: "Prodotto inserito",
  });
});

//modify category
app.put("/modify/category/:id", async (req, res) => {
  console.log("entro nella funzioen di modifica");
  const categoryId = new ObjectId(req.params._id);

  //filter
  let filter = { _id: categoryId };
  console.log(filter);

  //data
  const update = req.body;

  //updating
  const data = {
    //comando per modificare i dati
    $set: update,
  };

  console.log("oggetto finale", data);

  const ris = await categoriesCollection.updateOne(filter, data);
  console.log(ris);

  res.send({
    message: `Prodotto modificato con successo`,
    result: ris,
  });
});

//deleting product
app.delete("/delete/category/:id", async (req, res) => {
  // take the products id
  let categoryId = new ObjectId(req.params.id);
  console.log(categoryId);

  //create an object to pass in delte method
  const filter = { _id: categoryId };

  //dlete the category
  const ris = await categoriesCollection.deleteOne(filter);

  //send response
  res.send({
    res: ris,
  });
});

//todo        USER

// products
app.get("/users", async (req, res) => {
  const ris = await usersCollection.find({});

  let users = [];

  await ris.forEach((element) => {
    users.push(element);
  });

  res.send({ result: users });
});

//login
app.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  const ris = await usersCollection.findOne({
    email: email,
    password: password,
  });
  if (ris) {
    res.send({ result: ris });
  } else {
  }
});
