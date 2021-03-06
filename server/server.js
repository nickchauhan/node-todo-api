require("./config/config");

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const { ObjectID } = require("mongodb");
const bcrypt = require("bcryptjs");

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");

const { authenticate } = require("./middleware/authenticate");

var app = express();

app.use(bodyParser.json());

// Post Todo
app.post("/todos", authenticate, (req, res) => {
  var todo = new Todo({
    task: req.body.task,
    _creator: req.user._id
  });

  todo.save().then(
    todo => {
      res.send(todo);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

// Get all todos
app.get("/todos", authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then(
    todos => {
      res.send({ todos });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

// Get Todo By Id
app.get("/todos/:id", authenticate, (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send(todo);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

// Remove Todo by Id
app.delete("/todos/:id", authenticate, (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send(todo);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

// Update the todo by Id
app.patch("/todos/:id", authenticate, (req, res) => {
  let _id = req.params.id;
  var body = _.pick(req.body, ["task", "completed"]);

  if (!ObjectID.isValid(_id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  var _creator = req.user._id;

  Todo.findOneAndUpdate({ _id, _creator }, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send(todo);
    })
    .catch(e => res.status(400).send());
});

//Post /user

app.post("/users", (req, res) => {
  var user = new User(_.pick(req.body, ["email", "password"]));

  user
    .save()
    .then(() => {
      return user.generateAuthToken();
      // res.send(user);
    })
    .then(token => {
      res.header("x-auth", token).send(user);
    })
    .catch(e => res.status(400).send(e));
});

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

// Login User
app.post("/users/login", (req, res) => {
  var body = _.pick(req.body, ["email", "password"]);

  User.findByCrendentials(body.email, body.password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header("x-auth", token).send(user);
      });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

// Remove Token
app.delete("/users/me/token", authenticate, (req, res) => {
  req.user
    .removeToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch(() => {
      res.status(400).send();
    });
});

// Server Start
app.listen(port, () => {
  console.log(`Server up at Port ${port}`);
});

module.exports = {
  app
};
