// index.js


var server = require("./server");
var router = require("./router");
var wsServer = require("./wsServer");


var httpServer = server.create(router);
wsServer.create(httpServer);

httpServer.listen(8090);

