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
			clearTimeout(timer), timer = null;
			auth.checkAuth(socket, data.auth, function(isOK)
			{
				socket.emit(define.notiAuth, isOK);
				
				if(!isOK)
					socket.disconnect();
				else
				{//auth success. Then, send back. and, join the user to the room.
					
					var user = data.user;
					socket.join(user);
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
					if(timer) 
						clearTimeout(timer), timer = null;
					socket.disconnect();
				}
			}
		});
	});
};



