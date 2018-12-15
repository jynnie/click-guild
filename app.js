// dependencies
const express = require("express");
const path = require("path");
const pug = require("pug"); // view engine

const app = express();
const PORT = process.env.PORT || 8080;

// setting file paths
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "public")));

// rendering engine
app.set("view engine", "pug");

app.get("/", function(req, res) {
  res.render("index", { content: "hey boss" });
});

let http = require("http").Server(app);

// serving application
http.listen(PORT, function() {
  console.log("Running click guild on port " + PORT + "!");
});
