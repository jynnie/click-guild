// imports
const express = require("express");
const session = require("express-session");
const mongo = require("mongodb");
const router = express.Router();

// schemas
const User = require("../schemas/user");
const Quest = require("../schemas/quest");

router.get("/", function(req, res, next) {
  // check if user logged in
  if (req.session.userId) {
    var userId = req.session.userId;
    User.findOne({ _id: mongo.ObjectId(userId) }).exec((err, user) => {
      if (err) {
        console.log(err);
      } else if (user) {
        // user found
        res.render("index", { content: "hey boss", user: user });
      }
    });
  } else {
    res.render("index", { content: "hey boss" });
  }
});

router.get("/quests", (req, res, next) => {
  Quest.find({ lastActivity: { $gte: new Date() - 1000*60 } }).exec((err, quests) => {
    res.json(quests);
  });
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  // if all fields filled, ...
  if (req.body.email && req.body.username && req.body.password) {
    let newUser = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    };

    // check if user already exists with email, ...
    User.find(
      { $or: [{ email: req.body.email }, { username: req.body.username }] },
      (err, users) => {
        if (err) {
          console.log(err);
        }
        // if user exists, return error
        else if (users && users.length > 0) {
          return res.render("signup", {
            error: "Sorry, that username or email has already been taken"
          });
        }
        // if not, make user
        else {
          User.create(newUser, (error, user) => {
            if (error) {
              console.log(error);
              return next(error);
            } else {
              // set user id
              req.session.userId = user._id;
              console.log(
                `New user ${newUser.username} signed up with ${newUser.email}`
              );
              return res.redirect("/");
            }
          });
        }
      }
    );
  }
  // if not, send error
  else {
    return res.render("signup", {
      error: "All fields required to sign up"
    });
    // let error = new Error("All fields required to sign up");
    // error.status = 401;
    // return next(error);
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
    User.authenticate(username, password, (err, user) => {
      console.log(`Trying to login ${username}`);
      if (err || !user) {
        var error = new Error("Wrong username or password");
        error.status = 401;
        return next(error);
      } else {
        // set user id
        req.session.userId = user._id;
        return res.redirect("/");
      }
    });
  }
  // if not, send error
  else {
    return res.render("login", {
      error: "All fields required to login"
    });
    // let error = new Error("All fields required to login");
    // error.status = 401;
    // return next(error);
  }
});

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        console.log(err);
        return res.redirect("/");
      } else {
        return res.redirect("/");
      }
    });
  }
});

module.exports = router;
