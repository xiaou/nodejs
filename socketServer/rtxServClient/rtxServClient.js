// rtxServClient.js

var define = require("../define");
var net = require("net"); // tcp.
var log = require("../logger").log;


var isConnected = false;
var socket;
var timer = null;


function help2Connect(cb_afterConn)
{
	if(typeof socket !== 'undefined')
		socket.destroy();
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
		log.warning("try to connect rtx server again...");
		help2Connect(cb_afterConn);
	}, 1000 * define.rtxServConnectInterval);
}

exports.connect = function(funcRecvData)
{
return this; // test....
	log.info("then will connect to rtx server...");
	try2Connect(function(){
		socket.on("connect",  function()
		{
			isConnected = true;
			if(timer)
				clearInterval(timer), timer = null;
			
			log.info("connect to rtx server success~");
			
			funcRecvData({ type: "connect" });
		});
		
		socket.on("end", function()
		{
			isConnected = false;
			log.info("disconnect to rtx server !~");
			try2Connect();
		});
		
		socket.on("close", function(had_error)
		{
			isConnected = false;
			if(had_error)
				log.error("the socket was closed due to a transmission error. ");
		});
		
		socket.on("error", function(e)
		{
			log.error("error: error.code = " + e.code);
		});
		
		socket.on("data", function(data)
		{/** received data from tcp server in oa area. */
			log.debug("recv: " + data);
			funcRecvData(data);
		});
	});
	
	return this;
};


/** send data to the tcp server in oa area. */
exports.connect.prototype.send = exports.send = function(data)
{
	if(isConnected)
	{
		log.debug("send: " + data);
		socket.write(data);
	}
};
	
	
