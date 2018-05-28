const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("../server/models/user");

var userID = "5b0a6ac9f38c4a1b49080ba5";

var id = "5b0be67ae623bd2cfd014a5a";
if (!ObjectID.isValid(id)) {
  console.log("Id is not valid");
}

// find()

// Todo.find({
//   _id: id
// }).then(todos => {
//   console.log("Todos", todos);
// });

// findOne()

// Todo.findOne({
//   _id: id
// }).then(todo => {
//   console.log("Todo", todo);
// });

// findById

Todo.findById(id)
  .then(todo => {
    if (!todo) {
      return console.log("Todo Not found");
    }
    console.log("Todo", todo);
  })
  .catch(e => {
    console.log(e.message);
  });

// Find User
User.findById(userID)
  .then(user => {
    if (!user) {
      return console.log("User not found");
    }
    console.log("User", user);
  })
  .catch(err => {
    console.log(err.message);
  });
