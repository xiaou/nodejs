// server.js


var http = require("http");
var url = require("url");

function start(router)
{
	function onRequest(request, response)
	{
		var pathname = url.parse(request.url).pathname;
		
		if(router)
			router.route(pathname);

		response.writeHead(200, {"content-type": "text/plain"});
		response.write("hello 你妹 \n" + pathname);
		response.end();
	}

	http.createServer(onRequest).listen(8090);

	console.log("server is on 8090");
}

exports.start = start;

