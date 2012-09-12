// index.js


var router = require("./router");
var httpServer = require("./server").create(router);
var wsServer = require("./wsServer").create(httpServer);

wsServer.listen(8090);

