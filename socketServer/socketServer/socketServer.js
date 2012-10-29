// socketServer.js


var socketio = require("socket.io");
var nsHandlers = require("./nsHandlers");


exports.run = function(httpServer)
{
	var io = socketio.listen(httpServer
						, {log: false} 
						);
	
	console.log("socketServer is listening...");
	
	//run all sub servers(as 'namespace' of 'socket.io').
	nsHandlers.handleAll(io);
};
