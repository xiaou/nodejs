// router.js

var handle = require("./requestHandlers");
var fs = require("fs");

function route(pathname, request, response)
{
	if(typeof handle[pathname] == "function")
		handle[pathname](request, response);
	else
	{
		fs.readFile("." + pathname, 
		function(err, html)
		{
			if(err)
			{
				response.writeHead(404, {"content-type": "text/plain"});
				response.write("404. " + pathname + " Not found xx.");
				response.end();
			}
			else
			{
				response.writeHead(200, {"content-type": "text/plain"});
				response.write(html);
				response.end();
			}
		}
		);
	}
}

exports.route = route;



