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
const MONGO_URI = process.env.MONGO_URI || config.MONGO_URI;
const SECRET = process.env.SECRET || config.SECRET;

// mongoose setup
mongoose.set("useFindAndModify", false);
mongoose.connect(
  MONGO_URI,
  { dbName: "db", useNewUrlParser: true }
);

const Quest = require("./schemas/quest");

// initialize socket
const http = require("http").Server(app);
const io = require("socket.io")(http);

// partial generators
const questPartial = quest => {
  return pug.renderFile("views/partials/quest-socket.pug", { q: quest });
};

// HELPER FUNCTIONS
// user leaves quest and updates # of actives
const leaveQuest = socket => {
  if (socket.quest !== null) {
    socket.leave(socket.quest);
    console.log("User left quest " + socket.quest);

    Quest.findOneAndUpdate(
      { _id: socket.quest },
      { $inc: { clickers: -1 }, $set: { lastActivity: new Date() } },
      (err, quest) => {
        if (err || !quest) {
          console.log(err);
        } else {
          console.log(
            `Leaving: ${quest.clickers - 1} active for quest ${quest._id}`
          );

          io.to(quest._id).emit("active quest", quest);
        }
      }
    );
  }
  socket.quest = null;
};

/**
 * user joins quest and updates # of actives
 * @param {socket} socket
 * @param {string} id of quest to join
 **/
const joinQuest = (socket, id) => {
  leaveQuest(socket);
  socket.quest = id;

  socket.join(id);

  // ++ number of actives
  Quest.findOneAndUpdate(
    { _id: id },
    { $inc: { clickers: 1 }, $set: { lastActivity: new Date() } },
    (err, quest) => {
      if (err || !quest) {
        console.log(err);
      } else {
        quest.clickers++;
        console.log(`Joining: ${quest.clickers} active for quest ${quest._id}`);

        // send listing for this quest if you are the first active
        let listing = questPartial(quest);
        io.emit("new quest", quest._id, listing);

        io.to(quest._id).emit("active quest", quest);
      }
    }
  );


  console.log("User joined quest " + id);
};

// connecting to socket
io.on("connection", socket => {
  socket.quest = null; // keeps track of your current room
  console.log("Welcome new guest user!");

  socket.on("join", quest => {
    if (quest.leave != null && quest.leave != -1) {
      socket.quest = quest.leave;
    }

    joinQuest(socket, quest.join);
    Quest.findOne({ _id: quest.join }, (err, aq) => {
      if (err) {
        console.log(err);
      } else if (aq) {
        socket.emit("active quest", aq);
      }
    });
  });

  socket.on("click", quest => {
    console.log("Received click for quest " + quest);
    Quest.findOneAndUpdate(
      { _id: quest },
      { $inc: { clicks: 1 }, $set: { lastActivity: new Date() } },
      (err, res) => {
        if (err || !res) {
          console.log(err);
        } else {
          res.clicks++;
          console.log("Incremented clicks to " + res.clicks);
          io.to(quest).emit("clickUpdate", res);
        }
      }
    );
  });

  socket.on("find quest", leave => {
    if (leave != null && leave != -1) {
      socket.quest = leave;
    }

    Quest.makeNew(nq => {
      joinQuest(socket, nq._id);
      socket.emit("active quest", nq);
    });
  });

  socket.on("disconnect", () => {
    leaveQuest(socket);
    console.log("Guest user disconnected");
  });
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
    secret: SECRET,
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
