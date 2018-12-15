// dependencies
const express = require("express");
const path = require("path");
const pug = require("pug"); // view engine
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");

const config = require("./config.js");
const routes = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 8080;

// mongoose setup
mongoose.set("useFindAndModify", false);
mongoose.connect(
  config.MONGO_URI,
  { dbName: "db", useNewUrlParser: true }
);

const Quest = require("./schemas/quests");

// initialize socket
const http = require("http").Server(app);
const io = require("socket.io")(http);

// connecting to socket
io.on('connection', (socket) => {
  socket.on('join', (quest) => {
    console.log("User joined quest " + quest);
    socket.join(quest);
  });

  socket.on('click', (quest) => {
    console.log("Received click for quest " + quest);
    Quest.findOneAndUpdate(
      { id: quest }, 
      { $inc: { clicks: 1 } },
      (err, res) => {
        if (err || !res) {
          console.log(err);
        } else {
          console.log("Incremented clicks to " + res.clicks);
          io.to(quest).emit('clickUpdate', res);
        }
      }
    );
  });

  console.log("user connected to socket");
});

// setting file paths
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "public")));

// rendering engine
app.set("view engine", "pug");

// post request parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// create sessions
app.use(
  session({
    secret: config.SECRET,
    resave: false,
    saveUninitialized: true
  })
);

// routes modularized
app.use("/", routes);

// catch 404 error and send to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.locals.back = req.header("Referer") || "/";

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// serving application
http.listen(PORT, function() {
  console.log("Running click guild on port " + PORT + "!");
});

module.exports = app;
