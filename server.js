process.env.NODE_ENV = 'production';

var app = require("./app/app.js");

// Config
var PORT = 3000;

app.listen(PORT);
console.log("Check out http://127.0.0.1:" + PORT);
