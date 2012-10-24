// handler_moa_rtx.js


var define = require("../define");
var msgProtocal = require("./msgProtocal");
var auth = require("./auth_moa_rtx");
var rtxServClient = require("../rtxServClient/rtxServClient");
var log = require("../logger").log;
var util = require("util");

function ClientRoom()
{
	//If don't set those property, typeof they === 'undefined'.
	//so when recv moa client's auth pkg, set those.
	name = " It's the room of socket.io and It's Key of list send to rtx serv. ";
	data = " It's Value that the rtx serv care. ";
}
						
module.exports = function(ioSockets)
{
	/** key: socket. value: ClientRoom. @note: value may be same in diffirent key. */
	var clients = {};

	//
	rtxServClient.connect(function(objData) 
	{/** received object data from tcp server in oa area. */
		if(objData.type == "connect")
		{
			if(define.UDebug)
			{
				var type = 3;
				var list = [];
				for(var i = 0; i != 10; i++)
				{
					list.push( {
							 Key: 'ID1',
							 Value:
							 {
							 MsgId: '{62A029CB-6046-45A9-9665-F75B518F991E}', 
							 UserName: 'herolin'
							 }
							 } );
				}
				rooms = {
						 ReqType: type,
						 NotificationList: list
					};
			}
			else
			{
				for(var so_ in clients)
				{
					if(typeof clients[so_].name !== 'undefined')
						rooms[ clients[so_].name ] = clients[so_].data;
				}
			}
			
			rtxServClient.send(rooms);
		}
		else
		{//recv object data from rtx serv.
			if(define.UDebug)
			{
				for(var i in objData)
					log.debug("see :" + util.format("%j", objData[i]));
			}
			else
			ioSockets.in(objData.user/*'room' of socket.io*/).emit(
						define.noti4MoaRtx.message, objData.data);
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
		
		socket.on(msgProtocal.moa_rtx.auth, function(data)
		{
			clearTimeout(timer), timer = null;
			auth.checkAuth(socket, data, function(isOK)
			{
				socket.emit(msgProtocal.moa_rtx.auth, isOK);//send back to client.
				
				if(isOK)
				{//auth success. Then, join the user to the room.
					var user = data.user;
					socket.join(user);
				}
				else
				{
					socket.disconnect();
				}
			});
		});
		
		socket.on(msgProtocal.moa_rtx.message, function(data)
		{
			auth.hasAuth(socket, function(isHasAuth)
			{
				if(isHasAuth)
				{
					if(define.UDebug)
					{
						console.log(data);
						socket.emit(msgProtocal.moa_rtx.message, data);
						return;
					}
					
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



