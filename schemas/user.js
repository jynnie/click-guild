const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  guild: { type: String }
});

// authentication
userSchema.statics.authenticate = (username, password, callback) => {
  User.findOne({ username: username }).exec(function(err, user) {
    // checking for user
    if (err) {
      return callback(err);
    } else if (!user) {
      let err = new Error("No such user");
      err.status = 401;
      return callback(err);
    }

    bcrypt.compare(password, user.password, function(err, result) {
      if (result === true) {
        // user exists, return no error and user
        return callback(null, user);
      } else {
        return callback();
      }
    });
  });
};

// hash passwords with bcrypt
userSchema.pre("save", function(next) {
  let user = this;
  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

let User = mongoose.model("User", userSchema);

module.exports = User;
