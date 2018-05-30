require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const { ObjectID } = require("mongodb");

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Post Todo
app.post("/todos", (req, res) => {
  var todo = new Todo({
    task: req.body.task
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
app.get("/todos", (req, res) => {
  Todo.find().then(
    todos => {
      res.send({ todos });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

// Get Todo By Id
app.get("/todos/:id", (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findById(id)
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
app.delete("/todos/:id", (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id)
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
app.patch("/todos/:id", (req, res) => {
  let id = req.params.id;
  var body = _.pick(req.body, ["task", "completed"]);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send(todo);
    })
    .catch(e => res.status(400).send());
});

// Server Start
app.listen(port, () => {
  console.log(`Server up at Port ${port}`);
});

module.exports = {
  app
};
