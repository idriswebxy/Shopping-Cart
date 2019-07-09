"use strict";

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
// const data = require('./data');
const middleware = require('./api/middleware');

const data = [  
  {
    id: 1,
    name: 'Cool Vex',
    available_quantity: 5,
    price: 450,
    description: 'Lorem ipsum dolor sit amet, iusto appellantur vix te, nam affert feugait menandri eu. Magna simul ad est. Nostrum neglegentur ius at, at pertinax repudiare vel. Vim an adolescens quaerendum.'
  },
]

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// lists all available products
app.get("/api/products", (req, res) => {
  return res.json(data.products);
});

// generates a list of products in the cart
app.post("/api/products", (req, res) => {
  let products = [];
  let id = null;
  let cart = JSON.parse(req.body.cart);
  if (!cart) {
    return res.json(products);
  }
  for (var i = 0; i < data.products.length; i++) {
    id = data.products[i].id.toString();
    if (cart.hasOwnProperty(id)) {
      data.products[i].qty = cart[id];
      products.push(data.products[i]);
    }
  }
  return res.json(products);
});

// signs in users
app.post("/api/auth", (req, res) => {
  let user = data.users.filter(user => {
    return user.name == req.body && user.password == req.body.password;
  });
  // creates a token using username and password (valid for 2 hours)
  if (user.length) {
    let token_payload = { name: user[0].name, password: user[0].password };
    let token = jwt.sign(token_payload, "jwt_secret_password", {
      expiresIn: "2h"
    });
    let response = {
      message: "Token Created, Authentication Successful!",
      token: token
    };
    return res.status(200).json(response);
  } else {
    return res.status(401).json("Authentication failed. Admin not found.");
  }
});

app.get("/api/pay", middleware, (req, res) => {
  return res.json("Payment Successful!");
});

const port = 5000;

app.listen(port);
console.log(`App running on port ${port}...`);
