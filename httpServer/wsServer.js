// wsServer.js


var ws = require("websocket-server");
var server = ws.createServer({debug: true});


server.addListener("connection", 
function(connection)
{
	connection.addListener("message",
	function(message)
	{
		server.broadcast(message);
	}
	);
}
);

server.addListener("close",
function(connection)
{
		
}
);


server.listen(8091);





