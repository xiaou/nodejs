// index.js


var svr = require("./httpServer/server").create();
require("./socketServer/socketServer").run(svr);

