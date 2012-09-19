// socketServer.js


var socketio = require("../socket.io");
var nsHandlers = require("./nsHandlers");


exports.create = function(httpServer)
{
	var io = socketio.listen(httpServer
						, {log: false}
						);
	console.log("socketServer is listening...");
	
	nsHandlers.handleAll(io);
};
