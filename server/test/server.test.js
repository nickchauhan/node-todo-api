const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
const { User } = require("./../models/user");

const { todos, populateTodos, users, populateUsers } = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

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

// Test for GET /users/me route
describe("GET /users/me", done => {
  it("should return user if authenticated", done => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it("should return 401 if not authenticated", done => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

// POST /users
describe("POST /users", done => {
  it("should create user", done => {
    var email = "testing@gmail.com";
    var password = "HelloPass";
    request(app)
      .post("/users")
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.header["x-auth"]).toBeDefined();
        expect(res.body._id).toBeDefined();
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if (err) {
          return done(err);
        }

        User.findOne({ email })
          .then(usr => {
            expect(usr).toBeDefined();
            expect(usr.email).toBe(email);
            expect(usr.password).not.toBe(password);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it("should return validation errors if request invalid", done => {
    request(app)
      .post("/users")
      .send({ email: "teset", password: "hello" })
      .expect(400)
      .end(done);
  });

  it("should not create user if email already exits", done => {
    request(app)
      .post("/users")
      .send({
        email: users[0].email,
        password: "test"
      })
      .expect(400)
      .end(done);
  });
});

//Test POST /users/login route
describe("POST /users/login", done => {
  it("should return user for valid credentails", done => {
    request(app)
      .post("/users/login")
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[1]._id.toHexString());
        expect(res.body.email).toBe(users[1].email);
        expect(res.header["x-auth"]).toBeDefined();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens[0]).toMatchObject({
              access: "auth",
              token: res.header["x-auth"]
            });
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should reject the invalid login", done => {
    request(app)
      .post("/users/login")
      .send({
        email: users[1].email,
        password: users[1].password + 1
      })
      .expect(400)
      .expect(res => {
        expect(res.header["x-auth"]).toBeUndefined();
      })
      .end(err => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe("Delete User Token /users/me/token", done => {
  it("should remove token of user", done => {
    request(app)
      .delete("/users/me/token")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id)
          .then(usr => {
            expect(usr.tokens.length).toBe(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});
