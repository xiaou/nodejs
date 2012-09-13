// requestHandlers.js

var url = require("url");
var exec = require("child_process").exec;
var fs = require("fs");
var querystring = require("querystring");
var start_html;


function help2ResponseHtml(response, html)
{
	response.writeHead(200, {"content-type": "text/html"});
	response.write(html, "utf8");
	response.end();
}

function start(request, response)
{
	if(!start_html)
		fs.readFile("./start.html", 
		function(err, html)
		{
			if(err)
				throw err;
			else
			{
				help2ResponseHtml(response, html);
				start_html = html;
			}
		}
		);
	else
		help2ResponseHtml(response, start_html);
}

function upload(request, response)
{
	var postData = "";
	request.setEncoding("utf8");
	request.addListener("data",
	function(postDataChunk)
	{
		postData += postDataChunk;
	}
	);
	request.addListener("end",
	function()
	{
		help2ResponseHtml(response, 
		"recv data:<pre>" + querystring.parse(postData).text + "</pre>");
	}
	);
}

function terminal(request, response)
{
	var cmd = url.parse(request.url, true).query.cmd;
	exec(cmd, 
	function(error, stdout, stderr)
	{
		response.writeHead(200, {"content-type": "text/plain"});
		response.end("$ " + cmd + "\n\n" + stdout, "utf8");
	});
}


var handle = {};
handle["/start"] = handle["/"] = start;
handle["/upload"] = upload;
handle["/terminal"] = terminal;

module.exports = handle;

