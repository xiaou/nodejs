// server.js

var http = require("http");
var url = require("url");
var httpServer;

function create(router)
{
	function onRequest(request, response)
	{
		var pathname = url.parse(request.url).pathname;
		var postData = "";

		if(!router)
		{
			console.log("err: start() of server need router param!");
			return;
		}
		
		router.route(pathname, request, response);
	}

	httpServer = http.createServer(onRequest);
	
	console.log("server is on 8090");

	return httpServer;
}

exports.create = create;
exports.httpServer = httpServer;

