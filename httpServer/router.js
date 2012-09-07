// router.js

var handle = require("./requestHandlers");

function route(pathname)
{
	if(typeof handle[pathname] == "function")
		handle[pathname]();
	else
		console.log("no request handler found in \"requestHandlers\"");

}

exports.route = route;



