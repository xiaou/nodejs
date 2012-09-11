// wsServer.js


var ws = require("websocket-server");
var querystring = require("querystring");

function create(httpServer)
{
	var server = ws.createServer({debug: true, server: httpServer});

	server.addListener("connection", 
	function(connection)
	{
		server.broadcast("welcom xxx come.");

		connection.addListener("message",
		function(message)
		{
			connection.broadcast(message);
		}
		);
	}
	);
			  
	server.addListener("close",
	function(connection)
	{
		connection.broadcast(querystring.stringify({"quit": "somebody"}));
	}
	);
}

exports.create = create;


