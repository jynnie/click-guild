const mongoose = require("mongoose");

const questSchema = new mongoose.Schema({
  id: Number,
  descript: String,
  target: Number,
  clicks: Number,
  clickers: Number,
  status: Boolean
});

// find a random quest
questSchema.statics.makeNew = callback => {
  console.log("Find random quest!");
  let verbs = [
    "slay",
    "defeat",
    "feed",
    "find",
    "bury",
    "uncover",
    "yeet",
    "bring home",
    "escort",
    "transmute",
    "rescue",
    "pulverize",
    "cook",
    "put to sleep",
    "rub",
    "aid",
    "heal"
  ];
  let adjs = [
    "traditional",
    "earth",
    "divination",
    "hot",
    "beautiful",
    "oddly quiet",
    "mediocre",
    "baby blue",
    "sparkly",
    "spiky",
    "spooky",
    "sadistic",
    "magical",
    "young",
    "dumbass",
    "90s",
    "millenial",
    "borked",
    "busted",
    "nerfed",
    "gamer",
    "draconian",
    "sea",
    "your",
    "misty",
    "law-abiding",
    "cheerful"
  ];
  let noun = [
    "surprise",
    "sister",
    "lettuce",
    "pond",
    "witch",
    "dragon",
    "c++",
    "rocks",
    "guinea pigs",
    "unidentified creatures",
    "orcs",
    "demon",
    "demon lord",
    "revenant",
    "mountain",
    "swiss miss mix",
    "king gourd",
    "discord rebel",
    "devil",
    "angel",
    "creature",
    "coder",
    "snacks",
    "siri",
    "student",
    "princess",
    "prince",
    "queen",
    "citizen",
    "baby",
    "yokai",
    "weeb"
  ];

  let questObj;
  let newQuest = {
    descript: `${verbs[Math.floor(Math.random() * verbs.length)]} ${
      adjs[Math.floor(Math.random() * adjs.length)]
    } ${noun[Math.floor(Math.random() * noun.length)]}`,
    target: Math.floor(Math.random() * Math.floor(3000)),
    clicks: 0,
    clickers: 1,
    status: false
  };
  Quest.create(newQuest, (error, quest) => {
    if (error) {
      console.log(error);
      return callback(null);
    } else {
      questObj = quest;
      return callback(questObj);
    }
  });
};

const Quest = mongoose.model("Quest", questSchema);

module.exports = Quest;
