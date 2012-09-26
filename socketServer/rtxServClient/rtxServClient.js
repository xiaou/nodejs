// rtxServClient.js

var define = require("../define");
var net = require("net"); // tcp.
var logger = require("../logger").create(0, "log/log4rtxServClient.txt");


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
		logger.warning("try to connect rtx server again...");
		help2Connect(cb_afterConn);
	}, 1000 * define.rtxServConnectInterval);
}

exports.connect = function(func)
{
	logger.info("then will connect to rtx server...");
	
	try2Connect(function(){
		socket.on("connect",  function()
		{
			isConnected = true;
			if(timer)
				clearInterval(timer), timer = null;
			
			logger.info("connect to rtx server success~");
		});
		
		socket.on("end", function()
		{
			isConnected = false;
			logger.info("disconnect to rtx server !~");
			try2Connect();
		});
		
		socket.on("close", function(had_error)
		{
			isConnected = false;
			if(had_error)
				logger.error("the socket was closed due to a transmission error. ");
		});
		
		socket.on("error", function(e)
		{
			logger.error("error: error.code = " + e.code);
		});
		
		socket.on("data", function(data)
		{
			logger.debug("recv: " + data);
			func(data);
		});
	});
		
	this.send = function(data)
	{
		if(isConnected)
		{
			logger.debug("send: " + data);
			socket.write(data);
		}
	};
};


