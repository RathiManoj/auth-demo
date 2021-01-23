var mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

//use below line if using custom fields or createStrategy method
mongoose.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("user", userSchema);
