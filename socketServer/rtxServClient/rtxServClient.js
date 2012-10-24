// rtxServClient.js

var define = require("../define");
var net = require("net"); // tcp.
var log = require("../logger").log;
var util = require("util"); 


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

function help2Restart(){
	if(isConnected)
	{
		isConnected = false;
		log.info("disconnect to rtx server !~");
		try2Connect();
	}
}

function try2Connect()
{
	help2Connect();
	
	if(timer)
		clearInterval(timer), timer = null;
	timer = setInterval(function()
	{
		log.info("try to connect rtx server again...");
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
		log.debug("on end");
		help2Restart();
	});
	
	socket.on("close", function(had_error)
	{
		log.debug("on close");
		if(had_error)
			log.error("the socket was closed due to a transmission error. ");
		help2Restart();
	});
	
	socket.on("error", function(e)
	{
		log.debug("on error");
		log.error("error: error.code = " + e.code);
	});
	
	var aData = new Buffer(0);
	
	socket.on("data", function(data /**< it's 'Buffer' obj. */)
	{/** received data from tcp server in oa area. */
		aData = Buffer.concat([aData, data]);
		
		var len = aData.readUInt32BE(0);
		var strRes;
		while(aData.length > 3 && aData.length >= len)
		{
			strRes = aData.toString('utf8', 4, len);
			aData = aData.slice(len);
			
			if(define.UDebug)
			{
				log.debug("on data-see(I got): " + len + strRes);
			}
			
			//_funcRecvData(JSON.parse(strRes));
			
			// continue:
			len = aData.readUInt32BE(0, true);
		}
	});
	
	
	socket.on("drain", function()
	{
		if(define.UDebug)
			log.debug( "on drain. " + socket.bytesWritten + " bytesWritten" );
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
exports.connect.prototype.send = exports.send = function(objData)
{
	if(isConnected)
	{
		var str = util.format('%j', objData);
		log.debug("the str will be sending, it's length is " + str.length);
		
		var bufArray = [];
		var buf = new Buffer(4);
		buf.writeUInt32BE(str.length + 4, 0);
		bufArray.push(buf);
		var _len = str.length;
		var _len2;
		var _pos = 0;
		var _maxOnce = 1000;
		while(_len > 0)
		{
			_len2 = _len < _maxOnce ? _len : _maxOnce;
			buf = new Buffer(_len2);
			buf.write(str.substr(_pos, _len2 ), 0, _len2);
			bufArray.push(buf);
			_pos = _pos + _len2;
			_len = _len - _len2;
		} 
		
		for(var i in bufArray)

		if(define.UDebug)
		{
			//log.debug("send:\n" + str);
			//setInterval(function(){
				var b = socket.write(bufArray[i], 'utf8', function(d){
					//log.debug("has writen to Grady. " + socket.bytesWritten + "bytesWritten");
				});
				//log.debug("write() return: " + b + ". " + socket.bytesWritten + "bytesWritten");
			//}, 1000 * 5);
		}
		else
			socket.write(bufArray[i]);
	}
};
	
