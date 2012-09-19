// router.js


var fs = require("fs");

function route(pathname, request, response)
{
	fs.readFile("." + pathname, function(err, content)
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
			response.write(content);
			response.end();
		}
	});
}

exports.route = route;



