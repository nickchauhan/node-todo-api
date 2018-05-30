var env = process.env.NODE_ENV || "development";
if (env == "development") {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
} else if (env == "test") {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
} else {
  // mongodb://<dbuser>:<dbpassword>@ds137600.mlab.com:37600/todoapp
  process.env.MONGODB_URI =
    "mongodb://nikhil:nickMongo18@ds137600.mlab.com:37600/todoapp";
}
