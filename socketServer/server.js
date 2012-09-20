// server.js


var define = require("./define");
var https = require("https");
var url = require("url");
var fs = require("fs");
var socketServer = require("./socketServer/socketServer");

function run()
{
	var port = define.serverPort;
	
	function onRequest(request, response)
	{
		var pathname = url.parse(request.url).pathname;
		/* router要不要对于业务来说已经不重要了.毕竟这不是浏览网页的服务器.但还是留着吧.*/
		require("./router").route(pathname, request, response);
	}
	
	var options = 
	{
		key: fs.readFileSync("certs/key.pem"),
		cert: fs.readFileSync("certs/cert.pem")
	};

	httpsServer = https.createServer(options, onRequest);
	httpsServer.listen(port);	
	console.log("https server is running on port: " + port);
	
	socketServer.create(httpsServer);
}

exports.run = run;

