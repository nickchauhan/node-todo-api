const jwt = require("jsonwebtoken");

const { ObjectID } = require("mongodb");
const { Todo } = require("../../models/todo");
const { User } = require("../../models/user");

const todos = [
  {
    _id: new ObjectID(),
    task: "Learn Angular 6"
  },
  {
    _id: new ObjectID(),
    task: "Learn Reack 16"
  }
];

const populateTodos = done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
};

const UserOne = new ObjectID();
const UserTwo = new ObjectID();

const users = [
  {
    _id: UserOne,
    email: "nikhilchauhan@gmail.com",
    password: "nick@pass",
    tokens: [
      {
        access: "auth",
        token: jwt.sign({ _id: UserOne, access: "auth" }, "abc123").toString()
      }
    ]
  },
  {
    _id: UserTwo,
    email: "hemalichauhan@gmail.com",
    password: "hemi@pass",
    tokens: []
  }
];

const populateUsers = done => {
  User.remove({})
    .then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
