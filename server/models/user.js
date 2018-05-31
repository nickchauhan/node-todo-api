const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

// Schema for Users
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: [true, "User email id required"],
    minlength: 5,
    unique: true,
    validate: {
      validator: validator.isEmail,
      // validator: function(v) {
      //   var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      //   return emailRegex.test(v);
      // },
      message: "{VALUE} is not a valid email id!"
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

// Add methods to the User Model
UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ["_id", "email"]);
};
UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = "auth";
  var token = jwt
    .sign({ _id: user._id.toHexString(), access }, "abc123")
    .toString();
  user.tokens.push({ access, token });
  return user.save().then(() => token);
};

// Creating the Schema
var User = mongoose.model("Users", UserSchema);

module.exports = {
  User
};
