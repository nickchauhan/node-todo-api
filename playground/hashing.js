// const jwt = require("jsonwebtoken");

// var data = {
//   id: 10
// };

// var token = jwt.sign(data, "nickhash");
// console.log(token);
// var decoded = jwt.verify(token, "nickhash");
// console.log(decoded);

const bcrypt = require("bcryptjs");
var pass = "nick@password";

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(pass, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

var hashedPass = '$2a$10$EZ3m8YddL8Gufoh6/ORXVOnDNp5MyeF9v6Q8hg0J4nGFByqLGNx7.';


bcrypt.compare(pass, hashedPass, (err, res) => {
  console.log(res);
});
