const mongoose = require("mongoose");

const Quest = mongoose.model("Quest", { id: Number, clicks: Number });

module.exports = Quest;
