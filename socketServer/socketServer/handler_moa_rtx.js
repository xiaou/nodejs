// handler_moa_rtx.js


var define = require("../define");
var auth = require("./auth");


module.exports = function(ioSockets)
{
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
		
		socket.on(define.notiAuth, function(data)
		{
			clearTimeout(timer);
			auth.checkAuth(socket, data, function(isOK)
			{
				if(!isOK)
					socket.disconnect();
				else
				{//auth success. send back. and, save the user info in data.
					
				}
			});
		});
		
		socket.on(define.notiMessage, function(data)
		{
			auth.hasAuth(socket, function(isHasAuth)
			{
				if(isHasAuth)
				{
					//传递data
					//....
					
				}
				else
				{//居然还没发auth包，就发来了message包.直接断开你这个连接.
					socket.disconnect();
				}
			}
		});
	});
};



