const mongoose = require("mongoose");

const Quest = mongoose.model("Quest", {
  id: Number,
  descript: String,
  target: Number,
  clicks: Number,
  clickers: Number,
  status: Boolean
});

module.exports = Quest;
