// requestHandlers.js


function start()
{
	console.log("request handler start() was called");
}

function upload()
{
	console.log("request handler upload() was called");
}

//exports.start = start;
//exports.upload = upload;

var handle = {};
handle["/start"] = handle["/"] = start;
handle["/upload"] = upload;

module.exports = handle;

