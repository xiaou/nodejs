// rtxServClient.js

var define = require("../define");
var io = require("socket.io-client");


var isConnected = false;
var socket;
var timer = null;

function try2Connect()
{
	socket = io.connect(define.rtxServerLocation);
	timer = setInterval(function()
	{
		console.log("try to connect rtx server again...");
		socket = io.connect(define.rtxServerLocation);
	}, 1000 * define.rtxServConnectInterval);
}

exports.connect = function(func)
{
	console.log("then will connect to rtx server...");
	try2Connect();
	
	socket.on("connect",  function()
	{
		isConnected = true;
		if(timer)
			clearInterval(timer), timer = null;
		
		console.log("connect to rtx server success~");
	});
	
	socket.on("disconnect", function()
	{
		isConnected = false;
		console.log("disconnect to rtx server !~");
		try2Connect();
	});
	
	socket.on(define.noti4RtxServ.message, function(data)
	{
		func(data);
	});
	
	this.send = function(data)
	{
		if(isConnected)
			socket.emit(define.noti4RtxServ.message, data);
	};
};


