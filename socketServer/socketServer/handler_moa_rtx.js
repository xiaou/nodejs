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
	Key = " It's the room of socket.io and It's Key of list send to rtx serv. ";
	Value = " It's Value that the rtx serv care. ";
}
						
module.exports = function(ioSockets)
{
	/** key: socket. value: ClientRoom. @note: value may be same in diffirent key. */
	var clients = {};

	//
	rtxServClient.connect(function(objData) 
	{/** received object data from tcp server in oa area. */
		if(objData.type === "connect")
		{
			var rooms = {};
			rooms.ReqType = 3;
			var list = [];
			if(define.UDebug)
			{
				for(var i = 0; i != 2; i++)
				{
					list.push( {
							 Key: 'allanchen_page1',
							 Value:
							 {
							 MsgId: '{62A029CB-6046-45A9-9665-F75B518F991E}', 
							 UserName: 'herolin'
							 }
							 } );
				}
			}
			else
			{
				for(var so_ in clients)
				{
					if(typeof clients[so_].Key !== 'undefined')
						list.push( clients[so_] );
				}
			}
			rooms.NotificationList = list;
			rtxServClient.send(rooms);
		}
		else
		{//recv object data from rtx serv.
			if(define.UDebug)
			{
				for(var i in objData)
					console.log("see :" + objData[i].Key + ": " +  objData[i].Value.UserName );
			}
			
			for(var i in objData)
			{
				ioSockets.in(objData[i].Key/*'room' of socket.io*/).emit(
							msgProtocal.moa_rtx.message, objData[i].Value );
			}
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
			//send to rtx serv
			rtxServClient.send({ReqType:2 , NotificationList: [clients[socket]]});
		
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
				{//auth success.
					clients[socket].Key = data.Key;
					clients[socket].Value = data.Value;
					// Then, join the user to the room.
					socket.join(data.Key);
					//send to rtx serv
					rtxServClient.send({ReqType:1 , NotificationList: [clients[socket]]});
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



