// server.js

var https = require("https");
var http = require("http");
var url = require("url");
var fs = require("fs");

function create(router, isSecure)
{
	var port = 8090;

	if(!arguments[1]) 
		isSecure = false;

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

	if(isSecure)
	{
		var options = 
		{
			key: fs.readFileSync("certs/key.pem"),
			cert: fs.readFileSync("certs/cert.pem")
		};
	
		httpsServer = https.createServer(options, onRequest);
		
		httpsServer.listen(port);
		console.log("https server is on " + port);
		
		return httpsServer;
	}
	else
	{
		httpServer = http.createServer(onRequest);
		httpServer.listen(port);
		console.log("http server is on " + port);
	
		return httpServer;
	}
}

exports.create = create;

