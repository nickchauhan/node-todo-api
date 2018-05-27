const mongoose = require("mongoose");

var User = mongoose.model("Users", {
  name: {
    type: String,
    require: true,
    trim: 1,
    minlength: 2
  },
  email: {
    type: String,
    trim: true,
    required: [true, "User email id required"],
    validate: {
      validator: function(v) {
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(v);
      },
      message: "{VALUE} is not a valid email id!"
    }
  }
});

module.exports = {
  User
};
