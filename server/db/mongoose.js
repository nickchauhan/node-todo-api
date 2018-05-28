const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost:27017/TodoApp");
// mongodb://<dbuser>:<dbpassword>@ds137600.mlab.com:37600/todoapp

mongoose.connect(
  "mongodb://nikhil:nickMongo18@ds137600.mlab.com:37600/todoapp" ||
    "mongodb://localhost:27017/TodoApp"
);

module.exports = {
  mongoose
};
