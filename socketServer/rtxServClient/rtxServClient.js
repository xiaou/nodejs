// rtxServClient.js

var define = require("../define");
var net = require("net"); // tcp.


var isConnected = false;
var socket;
var timer = null;


function help2Connect(cb_afterConn)
{
	socket = net.connect( {port: define.rtxServerLocation.port, 
						   host: define.rtxServerLocation.host,
						   localAddress: define.rtxClientAddress
						   }
						 );
	socket.setKeepAlive(true, 1000 * define.rtxClientKeepAliveDelay);
	cb_afterConn();
}

function try2Connect(cb_afterConn)
{
	help2Connect(cb_afterConn);
	
	if(timer)
		clearInterval(timer), timer = null;
	timer = setInterval(function()
	{
		console.log("try to connect rtx server again...");
		help2Connect(cb_afterConn);
	}, 1000 * define.rtxServConnectInterval);
}

exports.connect = function(func)
{
	console.log("then will connect to rtx server...");
	
	try2Connect(function(){
		socket.on("connect",  function()
		{
			isConnected = true;
			if(timer)
				clearInterval(timer), timer = null;
			
			console.log("connect to rtx server success~");
		});
		
		socket.on("end", function()
		{
			isConnected = false;
			console.log("disconnect to rtx server !~");
			try2Connect();
		});
		
		//maybe not need "close" event~
		socket.on("close", function(had_error)
		{
			isConnected = false;
			if(had_error)
				console.log("the socket was closed due to a transmission error. ");
		});
		
		socket.on("error", function(e)
		{
			isConnected = false;
			console.log("error: error.code = " + e.code);
		});
		
		socket.on("data", function(data)
		{
			func(data);
		});
	});
		
	this.send = function(data)
	{
		if(isConnected)
			socket.write(data);
	};
};


