
var  wsServer = 
//'wss://localhost:8100/moa_rtx';
'wss://localhost:8100/socket.io/1/websocket/';
var  websocket = new WebSocket(wsServer);
websocket.onopen = function (evt) { onOpen(evt) }; 
websocket.onclose = function (evt) { onClose(evt) }; 
websocket.onmessage = function (evt) { onMessage(evt) }; 
websocket.onerror = function (evt) { onError(evt) }; 
function onOpen(evt) { 
	log("Connected to WebSocket server."); 
} 
function onClose(evt) { 
	log("Disconnected"); 
} 
function onMessage(evt) { 
	log('Retrieved data from server: ' + evt.data); 
} 
function onError(evt) { 
	log('Error occured: ' + evt.data); 
} 





