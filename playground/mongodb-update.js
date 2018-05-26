// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectID } = require("mongodb");
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

  // findOneAndUpdate()

  //   db
  //     .collection("Todos")
  //     .findOneAndUpdate(
  //       {
  //         // where
  //         _id: new ObjectID("5b0971d8a484380e13cf5d29")
  //       },
  //       {
  //         // what to update
  //         $set: {
  //           completed: true
  //         }
  //       },
  //       {
  //         // return new document after update
  //         returnOriginal: false
  //       }
  //     )
  //     .then(result => {
  //       console.log(result);
  //     });


//updateOne()

//   db
//     .collection("Users")
//     .updateOne(
//       {
//         location: "Bhavnagar"
//       },
//       {
//         $set: {
//           location: "Mumbai"
//         },
//         $inc: {
//           age: 1
//         }
//       }
//     )
//     .then(result => {
//       console.log(result);
//     });


  //updateMany()  

  db
  .collection("Users")
  .updateMany(
    {
      location: "Mumbai"
    },
    {
      $set: {
        location: "Bangalore"
      },
      $inc: {
        age: 1
      }
    }
  )
  .then(result => {
    console.log(result);
  });


    // client.close();
});
