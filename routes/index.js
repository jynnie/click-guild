const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {
  res.render("index", { content: "hey boss" });
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  // if all fields filled, ...
  if (req.body.email && req.body.username && req.body.password) {
    // check if user already exists with email, ...
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    // if not, make user
    console.log(`New user ${username} signed up with ${email}`);
  } else {
    // if not, send error
    let error = new Error("All fields required to sign up");
    error.status = 401;
    return next(error);
  }
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  // if all fields filled, ...
  if (req.body.username && req.body.password) {
    // check if user already exists with email, ...
    let username = req.body.username;
    let password = req.body.password;
    // if so, login ...
    console.log(`Tried to login ${username}`);
  } else {
    // if not, send error
    let error = new Error("All fields required to login");
    error.status = 401;
    return next(error);
  }
});

module.exports = router;
