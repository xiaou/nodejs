// nsHandlers.js


var define = require("../define");


exports.handleAll = function(io)
{
	var namespace;
	for(var index in define.namespaces)
	{
		namespace = define.namespaces[index]; 
		require("./handler" + namespace.replace("/", "_")) ( io.of(namespace) );
	}
};


