const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost:27017/TodoApp");
// mongodb://<dbuser>:<dbpassword>@ds137600.mlab.com:37600/todoapp
var monogoDbURL;
if (process.env.NODE_ENV) {
  monogoDbURL = "mongodb://nikhil:nickMongo18@ds137600.mlab.com:37600/todoapp";
} else {
  monogoDbURL = "mongodb://localhost:27017/TodoApp";
}

mongoose.connect(monogoDbURL);

module.exports = {
  mongoose
};
