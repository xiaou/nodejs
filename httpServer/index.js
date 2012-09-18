// index.js


var router = require("./router");
var svr = require("./server").create(router, false);
require("./webSocket").create(svr);


