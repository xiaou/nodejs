// index.js


var router = require("./router");
var svr = require("./server").create(router);
require("./webSocket").create(svr);


