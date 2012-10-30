// rtxServClient.js

var define = require("../define");
var net = require("net"); // tcp.
var log = require("../logger").log;
var util = require("util"); 


var client = function(){
	this.isConnected;
	this.socket;
	this.timer;
	this.cbRecvDataFunc;
	
	if(arguments.length === 0)
	{//init
		isConnected = false;
		timer = null;
	}
	
	return this;
}();


function help2Connect()
{
	if(typeof client.socket !== 'undefined')
		client.socket.destroy();
	client.socket = net.connect( {port: define.rtxServerLocation.port, 
						   host: define.rtxServerLocation.host,
						   localAddress: define.rtxClientAddress,
						   }
						 );
	client.socket.setKeepAlive(true, 1000 * define.rtxClientKeepAliveDelay);
	client.socket.setNoDelay(true);
	onEvent();
}

function help2Restart(){
	if(client.isConnected)
	{
		client.isConnected = false;
		log.info("disconnect to rtx server !~");
		try2Connect();
	}
}

function try2Connect()
{
	help2Connect();
	
	if(client.timer)
		clearInterval(client.timer), client.timer = null;
	client.timer = setInterval(function()
	{
		log.info("try to connect rtx server again...");
		help2Connect();
	}, 1000 * define.rtxServConnectInterval);
}

function onEvent(){
	client.socket.on("connect",  function()
	{
		client.isConnected = true;
		if(client.timer)
			clearInterval(client.timer), client.timer = null;
		
		log.info("connect to rtx server success~" + "( " + client.socket.address().address + ": " + client.socket.address().port + " -> " + client.socket.remoteAddress + ": " + client.socket.remotePort + " )");
		
		client.cbRecvDataFunc({ type: "connect" });
	});
	
	client.socket.on("end", function()
	{
		log.debug("on end");
		help2Restart();
	});
	
	client.socket.on("close", function(had_error)
	{
		log.debug("on close");
		if(had_error)
			log.error("the socket was closed due to a transmission error. ");
		help2Restart();
	});
	
	client.socket.on("error", function(e)
	{
		log.debug("on error");
		log.error("error: error.code = " + e.code);
	});
	
	var aData = new Buffer(0);
	
	client.socket.on("data", function(data /**< it's 'Buffer' obj. */)
	{/** received data from tcp server in oa area. */
		aData = Buffer.concat([aData, data]);
		
		var len = aData.readUInt32BE(0);
		var strRes;
		var eb;//end byte.
		while(aData.length > 3 && aData.length >= len)
		{
			//检验结束符
			eb = aData.readInt8(len - 1);
			if(eb !== define.endByte)
			{
				help2Restart();
				break;
			}
		
			strRes = aData.toString('utf8', 4, len-1);
			aData = aData.slice(len);
			
			if(define.UDebug)
			{
				log.debug("on data(I got): " + len + strRes + "EndByte");
			}
			
			client.cbRecvDataFunc(JSON.parse(strRes));
			
			// continue:
			len = aData.readUInt32BE(0, true);
		}
	});
	
	
	client.socket.on("drain", function()
	{
		if(define.UDebug)
			log.debug( "on drain. " + client.socket.bytesWritten + " bytesWritten" );
	});
}

exports.connect = function(cbRecvDataFunc)
{
	log.info("then will connect to rtx server...");
	client.cbRecvDataFunc = cbRecvDataFunc;
	try2Connect();
	return this;
};

/** send data to the tcp server in oa area. */
exports.connect.prototype.send = exports.send = function(objData)
{
	if(client.isConnected)
	{
		var str = util.format('%j', objData);
		log.debug("the str will be sending, length = " + str.length + ", content is:[" + str.substr(0, 20) + "...]");
		
		var bufArray = [];
		var buf = new Buffer(4);
		buf.writeUInt32BE(str.length + 4 + 1 , 0);
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
		
		var bufEndByte = new Buffer(1);
		bufEndByte.writeInt8(define.endByte, 0);
		bufArray[bufArray.length - 1] = Buffer.concat([bufArray[bufArray.length - 1], bufEndByte]);
		
		if(bufArray.length > 1)
		{
			bufArray[0] = Buffer.concat([bufArray[0], bufArray[1]]);
			bufArray.splice(1, 1);
		}
		
		if(define.UDebug)
		{
			/*if(define.EDebug)
			{
				var bufList = [];
				console.log("开始构造bufList...");
				for(var i = 0; i != 3; i++)
				{
					console.log("添加" + (i+1) + '次:');
					bufList.push( Buffer.concat(bufArray) );
				}console.log("完成！");
				
				var bufferAll = Buffer.concat(bufList);
				console.log( util.format("%s", bufferAll) );
				
				var b = client.socket.write(bufferAll, 'utf8', function(d){
					log.debug("has writen to Grady. " + client.socket.bytesWritten + "bytesWritten")
				});
				log.debug("write() return: " + b + ". " + client.socket.bytesWritten + "bytesWritten");
			}
			else
			*/{
				//setInterval(function(){
				for(var i in bufArray)
				{
					var b = client.socket.write(bufArray[i], 'utf8', function(d){
						//log.debug("has writen to Grady. " + client.socket.bytesWritten + "bytesWritten");
					});
					//log.debug("write() return: " + b + ". " + client.socket.bytesWritten + "bytesWritten");
				}
				//}, 1000 * 5);
			}
		}
		else
		{
			for(var i in bufArray)
				client.socket.write(bufArray[i]);
		}
	}
};
	
