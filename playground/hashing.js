const jwt = require("jsonwebtoken");

var data = {
  id: 10
};

var token = jwt.sign(data, "nickhash");
console.log(token);
var decoded = jwt.verify(token, "nickhash");
console.log(decoded);
