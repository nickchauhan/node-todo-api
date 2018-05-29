const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("../server/models/user");

// Remove the doc from the db
// Todo.remove({}).then(result => {
//   console.log(result);
// });

// Todo.findOneAndRemove({ _id: "5b0c168d41402338b7692e46" }).then(todo => {
//   console.log(todo);
// });

// 5b0d3eefa484380e13cf5e08

Todo.findByIdAndRemove("5b0d3eefa484380e13cf5e08").then(todo => {
  console.log(todo);
});
