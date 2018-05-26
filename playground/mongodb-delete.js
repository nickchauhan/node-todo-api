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

  // deleteOne()
//   db
//     .collection("Users")
//     .deleteOne({ name: "Chetan" })
//     .then(result => {
//       console.log(result);
//     });

  // deleteMany()

//   db
//   .collection("Users")
//   .deleteMany({ location: "Bhavnagar" })
//   .then(result => {
//     console.log(result);
//   });

  //findOneAndDelete()

  db
  .collection("Users")
  .findOneAndDelete({ name: "Nikhil" })
  .then(result => {
    console.log(result);
  });

//   client.close();
});
