const expect = require("expect");
const request = require("supertest");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");

beforeEach(done => {
  Todo.remove({}).then(() => done());
});

describe("Post /todos", () => {
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

        Todo.find().then(todos => {
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
          expect(todos.length).toBe(0);
          done();
        });
      });
  });
});
