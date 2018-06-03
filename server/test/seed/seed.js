const jwt = require("jsonwebtoken");

const { ObjectID } = require("mongodb");
const { Todo } = require("../../models/todo");
const { User } = require("../../models/user");

const UserOneID = new ObjectID();
const UserTwoID = new ObjectID();

const users = [
  {
    _id: UserOneID,
    email: "nikhilchauhan@gmail.com",
    password: "nick@pass",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: UserOneID, access: "auth" }, process.env.JWT_SECRET)
          .toString()
      }
    ]
  },
  {
    _id: UserTwoID,
    email: "hemalichauhan@gmail.com",
    password: "hemi@pass",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: UserTwoID, access: "auth" }, process.env.JWT_SECRET)
          .toString()
      }
    ]
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

const todos = [
  {
    _id: new ObjectID(),
    task: "Learn Angular 6",
    _creator: UserOneID
  },
  {
    _id: new ObjectID(),
    task: "Learn Reack 16",
    completed: true,
    completedAt: 8237489234,
    _creator: UserTwoID
  }
];

const populateTodos = done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
