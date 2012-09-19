// webSocket.js


var socketio = require("socket.io");
var querystring = require("querystring");
var util = require('util');
var myUtil = require("./myUtil");
var chatEventLib = require("./chatEventLib");
var CHAT_EVENT = chatEventLib.CHAT_EVENT;
var CHAT_EVENT_TYPE = chatEventLib.CHAT_EVENT_TYPE;


function create(httpServer)
{
	var io = socketio.listen(httpServer
							, {log: true}
							);
	var ioChatSockets = io.of("/chat");
	var clients = [];

	ioChatSockets.on("connection", 
	function(socket)
	{
		clients.push(socket);
		
		ioChatSockets.emit(CHAT_EVENT, 
		{
			type: CHAT_EVENT_TYPE.INFO,
			data: "welcome " + socket.id + "~",
			time: myUtil.getTime()
		}
		);
		
		socket.on("disconnect",
		function()
		{
			clients.splice(clients.indexOf(socket), 1);
			
			socket.broadcast.emit(CHAT_EVENT, 
			{
				type: CHAT_EVENT_TYPE.INFO,
				data: "ByeBye " + socket.id + "~",
				time: myUtil.getTime()
			}
			);
		}
		);
		
		socket.on(CHAT_EVENT,
		function(data)
		{
			switch(data.type)
			{
				case CHAT_EVENT_TYPE.NAME:
				{
					socket.set(CHAT_EVENT_TYPE.NAME, data.data, 
					function()
					{
						ioChatSockets.emit(CHAT_EVENT,
						{
							type: CHAT_EVENT_TYPE.INFO,
							data: socket.id + " (re)named:" + data.data,
							time: myUtil.getTime()
						}
						);
					}
					);
				}
				break;
				
				case CHAT_EVENT_TYPE.SAY:
				{
					if(data.data.indexOf("/list") == 0)
					{
						data.data = "/list\n";
						
						clients.forEach(function(client, index)
						{
							client.get(CHAT_EVENT_TYPE.NAME,
							function(err, name)
							{
								if(err)
									name = "";
								data.data += "\n\t" + name + " (" + client.id + ")" + " address:" + client.handshake.address.address + ":" + client.handshake.address.port;
							}
							);
						}
						);
					}
					
					socket.get(CHAT_EVENT_TYPE.NAME, 
					function(err, name)
					{
						if(err)
							name = "";
						ioChatSockets.emit(CHAT_EVENT,
						{
							type: CHAT_EVENT_TYPE.SAY,
							user: name + " (" + socket.id + ")",
							data: data.data,
							time: myUtil.getTime()
						}
						);
					}
					);
				}
				break;
				
			}
		}
		);
	}
	);

}

exports.create = create;

