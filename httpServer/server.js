// server.js

var http = require("http");
var url = require("url");


function start(router)
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

	http.createServer(onRequest).listen(8090);

	console.log("server is on 8090");
}

exports.start = start;

