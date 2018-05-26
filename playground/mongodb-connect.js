// const MongoClient = require("mongodb").MongoClient;
const { MongoClient} = require("mongodb");
const assert = require("assert");

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "TodoApp";

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  // Insert a single document
  //   db
  //     .collection("Todos")
  //     .insertOne({ text: "Some task", completed: false }, (err, r) => {
  //       assert.equal(null, err);
  //       assert.equal(1, r.insertedCount);
  //     });

  db.collection("Users").insertOne(
    {
      name: "Dilip",
      age: "45",
      location: "Gujarat"
    },
    (err, r) => {
      assert.equal(null, err);
      assert.equal(1, r.insertedCount);
      // To get the document inserted
    //   console.log(r.ops);
    }
  );

  client.close();
});
