// rtxServClient.js

var define = require("../define");
var net = require("net"); // tcp.
var log = require("../logger").log;


var isConnected = false;
var socket;
var timer = null;
var _funcRecvData;

function help2Connect()
{
	if(typeof socket !== 'undefined')
		socket.destroy();
	socket = net.connect( {port: define.rtxServerLocation.port, 
						   host: define.rtxServerLocation.host,
						   localAddress: define.rtxClientAddress,
						   }
						 );
	socket.setKeepAlive(true, 1000 * define.rtxClientKeepAliveDelay);
	socket.setNoDelay(true);
	onEvent();
}

function try2Connect()
{
	help2Connect();
	
	if(timer)
		clearInterval(timer), timer = null;
	timer = setInterval(function()
	{
		log.warning("try to connect rtx server again...");
		help2Connect();
	}, 1000 * define.rtxServConnectInterval);
}

function onEvent(){
	socket.on("connect",  function()
	{
		isConnected = true;
		if(timer)
			clearInterval(timer), timer = null;
		
		log.info("connect to rtx server success~");
		
		_funcRecvData({ type: "connect" });
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
		_funcRecvData(data);
	});
}

exports.connect = function(funcRecvData)
{
	//return this; // when only test moa_rtx client....
	log.info("then will connect to rtx server...");
	_funcRecvData = funcRecvData;
	try2Connect();
	return this;
};

/** send data to the tcp server in oa area. */
exports.connect.prototype.send = exports.send = function(data)
{
	if(isConnected)
	{
		var str = require('util').format('%j', data);
		
		if(define.UDebug)
		{
			log.debug("send:\n" + str);
			setInterval(function(){
				var b = socket.write(str, 'utf8', function(d){
					log.debug("has writen to Grady.");
				});
				log.debug("write() return: " + b);
			}, 1000 * 5);
		}
		else
			socket.write(str);
	}
};
	
	
