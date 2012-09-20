// nsHandlers.js


var define = require("../define");


var handle = {};
handle[define.nsMoaRtx] = require("./handler" + define.nsMoaRtx.replace("/", "_"));
//handle[define.nsXXXX] = require("./handler" + define.nsXXXX.replace("/", "_"));


exports.handleAll = function(io)
{
	for(var namespace in handle)
	{
		handle[namespace]( io.of(namespace) );
	}
};


