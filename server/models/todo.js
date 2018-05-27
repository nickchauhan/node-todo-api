const mongoose = require("mongoose");

var Todo = mongoose.model("Todo", {
  task: {
    type: String,
    reqiured: true,
    trim: true,
    minlength: 1
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports = {
  Todo
};
