// wsServer.js


var ws = require("websocket-server");
var querystring = require("querystring");

function create(httpServer)
{
	var wsDebug = true;

	if(httpServer)
		wsServer = ws.createServer({debug: wsDebug, server: httpServer});
	else
		wsServer = ws.createServer({debug: wsDebug});

	wsServer.addListener("connection", 
	function(connection)
	{
		console.log(connection.id + " connected~");

		//wsServer.broadcast("welcom xxx come.");

		connection.addListener("message",
		function(message)
		{
			console.log("recv message~");
			//connection.broadcast(message);
		}
		);

		connection.addListener("close",
		function()
		{
			console.log(connection.id + " closed~");
		}
		);
	}
	);
			  
	wsServer.addListener("close",
	function(connection)
	{
		console.log(connection.id + "closed by server!");

		//connection.broadcast(querystring.stringify({"quit": "somebody"}));
	}
	);

	return wsServer;
}

exports.create = create;

