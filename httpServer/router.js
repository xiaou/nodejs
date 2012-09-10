// router.js

var handle = require("./requestHandlers");

function route(pathname, request, response)
{
	if(typeof handle[pathname] == "function")
		handle[pathname](request, response);
	else
	{
		response.writeHead(404, {"content-type": "text/plain"});
		response.write("404. " + pathname + " Not found.");
		response.end();
	}
}

exports.route = route;



