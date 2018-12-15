// dependencies
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const pug = require("pug"); // view engine

const routes = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 8080;

// initialize socket
const http = require("http").Server(app);
const io = require("socket.io")(http);

// setting file paths
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "public")));

// rendering engine
app.set("view engine", "pug");

// post request parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes modularized
app.use("/", routes);

// catch 404 error and send to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.locals.back = req.header("Referer") || "/";

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// connecting to socket
io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("user input", function(msg) {
    userInput(msg, socket);
  });
});

// serving application
http.listen(PORT, function() {
  console.log("Running click guild on port " + PORT + "!");
});

module.exports = app;