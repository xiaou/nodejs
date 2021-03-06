// server.js


var define = require("../define");
var https = require("https");
var http = require("http");
var url = require("url");
var fs = require("fs");
var socketServer = require("../socketServer/socketServer");

function create()
{
	var port = define.serverPort;
	var host = define.serverHost;
	
	function onRequest(request, response)
	{
		var pathname = url.parse(request.url).pathname;
		console.log("http router handle for \"" + pathname + "\"...");
		/* router要不要对于业务来说已经不重要了.毕竟这不是浏览网页的服务器.但还是留着吧.*/
		require("./router").route(pathname, request, response);
	}
	
	var options = 
	{
		key: fs.readFileSync("certs/key.pem"),
		cert: fs.readFileSync("certs/cert.pem")
	};

	if(define.isHttps)
	{
		httpsServer = https.createServer(options, onRequest);
		httpsServer.listen(port, host);	
		console.log("https server is running on " + host + ":" + port);
	}
	else
	{
		httpsServer = http.createServer(onRequest);
		httpsServer.listen(port, host);	
		console.log("http server is running on " + host + ":" + port);
	}
	
	return httpsServer;
}

exports.create = create;

