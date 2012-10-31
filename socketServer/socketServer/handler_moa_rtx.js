// handler_moa_rtx.js


var define = require("../define");
var msgProtocal = require("./msgProtocal");
var auth = require("./auth_moa_rtx");
var rtxServClient = require("../rtxServClient/rtxServClient");
var log = require("../logger").log;
var util = require("util");

function ClientRoom()
{
	//If don't set those property(eg: new ClientRoom()), typeof they === 'undefined'.
	Key = " It's the room of socket.io and It's Key of list send to rtx serv. ";
	Value = " It's Value that the rtx serv care. ";
}

/*
 * clients是字典.
 * key: socket.id  
 * value: ClientRoom. 
 * @note: value may be same in diffirent key. 
 */
var clients = {};
							
module.exports = function(ioSockets)
{
	rtxServClient.connect(function(objData) {
	/** received object data from tcp server in oa area. */
		if(objData.type === "connect"){
			var rooms = {};
			rooms.ReqType = 3;
			var list = [];
			/*if(define.UDebug){
				for(var i = 0; i != 2; i++){
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
			else*/{
				for(var so_id in clients)
					list.push( clients[so_id] );
			}
			rooms.NotificationList = list;
			rtxServClient.send(rooms);
		}
		else{
		//recv object data from rtx serv.
			if(define.UDebug){
				for(var i in objData){
					log.debug("rtx srv -> moa :" + util.format("%j", objData[i]));
				}
			}
			
			for(var i in objData){
				ioSockets.in(objData[i].Key/*'room' of socket.io*/).emit(
							msgProtocal.moa_rtx.message, objData[i].Value );
			}
		}
	});
	
	//
	ioSockets.on("connection", function(socket){		
		log.debug("see: conn. socket.id = " + socket.id);
		
		var timer = setTimeout(function() {
			auth.hasAuth(socket, function(isHasAuth){
				if(!isHasAuth){
					log.error("timeout! and still not auth!");
					timer = null;
					socket.disconnect();
				}
			});
		}, 1000 * define.authTimeOut);
		
		socket.on("disconnect", function(){
			log.error("see: disconnect. socket.id = " + socket.id);
			
			if(timer){ clearTimeout(timer), timer = null; }
			auth.hasAuth(socket, function(isHasAuth){
				if(isHasAuth){
					log.error("(socket.id = " + socket.id + ".) Then send ReqType=2. list:[" + util.format("%j", clients[socket.id]) + "]");
					
					//send to rtx serv
					rtxServClient.send({ReqType:2 , NotificationList: [clients[socket.id]]});
					
					//
					delete clients[socket.id];
				}
			});
		});
		
		socket.on(msgProtocal.moa_rtx.auth, function(data){
			log.debug("see: auth. socket.id = " + socket.id);
		
			clearTimeout(timer), timer = null;
			
			auth.checkAuth(socket, data, function(isOK){
				socket.emit(msgProtocal.moa_rtx.auth, isOK);//send back to client.	
				if(isOK){
				//auth success.
					if(define.UDebug){
						log.debug("(socket.id = " + socket.id + ".) moa -> srv (auth success):\n" + util.format(data));
					}
					clients[socket.id] = {Key: data.Key, Value: data.Value};
					// Then, join the user to the room.
					socket.join(data.Key);
					//send to rtx serv
					rtxServClient.send({ReqType:1 , NotificationList: [clients[socket.id]]});
				}
				else{
					socket.disconnect();
				}
			});
		});
		
		socket.on(msgProtocal.moa_rtx.message, function(data){
			log.debug("see: message. socket.id = " + socket.id);
			
			auth.hasAuth(socket, function(isHasAuth){
				if(isHasAuth){
					if(define.UDebug){
						log.debug("srv -> moa (message, test back):" + data);
						socket.emit(msgProtocal.moa_rtx.message, data);
						return;
					}
					
					//send data to the tcp server in oa area.
					//....
					rtxServClient.send(data);
				}
				else{
				//居然没发auth包就发来了message包.直接断开这个连接.
					log.error("havn't auth!!!! srv <- moa (message, will close you!):" + data);
					if(timer) { clearTimeout(timer), timer = null; }
					socket.disconnect();
				}
			});
		});
	});
};



