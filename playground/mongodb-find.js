// const MongoClient = require("mongodb").MongoClient;
const { MongoClient } = require("mongodb");
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

  // find the data in the collection
  db
    .collection("Users")
    .find({ location: "Gujarat" })
    .toArray()
    .then(
      docs => {
        console.log(JSON.stringify(docs, undefined, 2));
      },
      err => {
        console.log("Unable to fetch Data:" + err);
      }
    );

  // count the data
  db
    .collection("Users")
    .find({ location: "Gujarat" })
    .count()
    .then(
      count => {
        console.log("No of people staying in Gujarat: " + count);
      },
      err => {
        console.log("Unable to fetch Data:" + err);
      }
    );

  client.close();
});
