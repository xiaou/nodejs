// handler_moa_rtx.js


var define = require("../define");
var auth = require("./auth_moa_rtx");
var rtxServClient = require("../rtxServClient/rtxServClient");
var logger = require("../logger").create(define.logConfig.moa_rtx.level, 
										define.logConfig.moa_rtx.filename);

										
module.exports = function(ioSockets)
{
	//
	var rtxServConn = rtxServClient.connect(function(data)
	{// receive data from rtxServ
		ioSockets.in(data.user/*'namespace' of socket.io*/).emit(
					define.noti4MoaRtx.message, data.data);
	});
	
	//
	var clients = [];
	
	ioSockets.on("connection", function(socket)
	{
		clients.push(socket);
		
		var timer = setTimeout(function() 
		{
			auth.hasAuth(socket, function(isHasAuth)
			{
				if(!isHasAuth)
				{
					socket.disconnect();
				}
			});
		}, 1000 * define.authTimeOut);
		
		socket.on("disconnect", function()
		{
			clients.splice(clients.indexOf(socket), 1);
		});
		
		socket.on(define.noti4MoaRtx.auth, function(data)
		{
			clearTimeout(timer), timer = null;
			auth.checkAuth(socket, data.auth, function(isOK)
			{
				socket.emit(define.noti4MoaRtx.auth, isOK);//send back to client.
				
				if(isOK)
				{//auth success. Then, join the user to the room.
					var user = data.user;
					socket.join(user);
				}
				else
					socket.disconnect();
			});
		});
		
		socket.on(define.noti4MoaRtx.message, function(data)
		{
			auth.hasAuth(socket, function(isHasAuth)
			{
				if(isHasAuth)
				{
					//传递data到rtxServer
					//....
					rtxServConn.send(data);
				}
				else
				{//居然没发auth包就发来了message包.直接断开这个连接.
					if(timer) 
						clearTimeout(timer), timer = null;
					socket.disconnect();
				}
			});
		});
	});
};



