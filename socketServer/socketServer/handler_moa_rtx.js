// handler_moa_rtx.js


var define = require("../define");
var auth = require("./auth_moa_rtx");
var rtxServClient = require("../rtxServClient/rtxServClient");
var logger = require("../logger").create(define.logConfig.moa_rtx.level, 
										define.logConfig.moa_rtx.filename);

function ClientRoom()
{
	//If don't set those property, typeof they === 'undefined'.
	//so when recv moa client's auth pkg, set those.
	name = " It's the room of socket.io. ";
	data = " It's data that the rtx serv care. ";
}
						
module.exports = function(ioSockets)
{
	/** key: socket. value: ClientRoom. @note: value may be same in diffirent key. */
	var clients = {};

	//
	rtxServClient.connect(function(data) 
	{/** received data from tcp server in oa area. */
		if(data.type == "connect")
		{
			var rooms = {};
			for(var so_ in clients)
			{
				if(typeof clients[so_].name !== 'undefined')
					rooms[ clients[so_].name ] = clients[so_].data;
			}
			rtxServClient.send(rooms);
		}
		else
		{
			ioSockets.in(data.user/*'room' of socket.io*/).emit(
						define.noti4MoaRtx.message, data.data);
					
		}
	});
	
	//
	ioSockets.on("connection", function(socket)
	{
		//clients.push(socket);
		clients[socket] = new ClientRoom();
		
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
			//clients.splice(clients.indexOf(socket), 1);
			delete clients[socket];
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
					//send data to the tcp server in oa area.
					//....
					rtxServClient.send(data);
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



