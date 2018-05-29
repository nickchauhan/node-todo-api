const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");

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

beforeEach(done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
});

// Test for POST for /todos
describe("POST /todos", () => {
  it("should create a new todo", done => {
    var task = "Test the Todo Post api";

    request(app)
      .post("/todos")
      .send({ task })
      .expect(200)
      .expect(res => {
        expect(res.body.task).toBe(task);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({ task }).then(todos => {
          expect(todos.length).toBe(1);
          expect(todos[0].task).toBe(task);
          done();
        });
      });
  });

  it("should not create Todo for bad data", done => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then(todos => {
          expect(todos.length).toBe(2);
          done();
        });
      });
  });
});

// Test For GET /todos
describe("GET /todos", () => {
  it("should get all the todos", done => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

// Test for GET todo /todo/:id
describe("GET todo /todo/:id", done => {
  it("should return the todo doc", done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.task).toBe(todos[0].task);
      })
      .end(done);
  });

  it("should return 404 if todo not found", done => {
    let id = new ObjectID();
    request(app)
      .get(`/todos/${id.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it("should return 400 if non-object ids", done => {
    request(app)
      .get(`/todos/2234j2k3`)
      .expect(404)
      .end(done);
  });
});

// Test for DELETE Todo Id
describe("DELETE Todo /todos/:id ", done => {
  it("should return the deleted doc", done => {
    var hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toBeFalsy();
            done();
          })
          .catch(err => {
            done(err);
          });
      });
  });

  it("should return 404 if todo not found", done => {
    let id = new ObjectID();
    request(app)
      .delete(`/todos/${id.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it("it should return 404 if object ID is invalid", done => {
    request(app)
      .delete(`/todos/2234j2k3`)
      .expect(404)
      .end(done);
  });
});

// Test for UPDATE todos
describe("PATCH Todo /todos/:id", done => {
  it("should update the todo", done => {
    let id = todos[0]._id.toHexString();
    let task = "Change the task from test";

    request(app)
      .patch(`/todos/${id}`)
      .send({ task, completed: true })
      .expect(200)
      .expect(res => {
        expect(res.body.task).toBe(task);
        expect(res.body.completed).toBe(true);
        expect(res.body.completedAt).toBeDefined();
      })
      .end(done);
  });

  it("should clear completedAt when todo is not completed", done => {

    let id = todos[0]._id.toHexString();
    let task = "Change the task from test";

    request(app)
      .patch(`/todos/${id}`)
      .send({ task, completed: false })
      .expect(200)
      .expect(res => {
        expect(res.body.task).toBe(task);
        expect(res.body.completed).toBe(false);
        expect(res.body.completedAt).toBeNull();
      })
      .end(done);
  });
});
