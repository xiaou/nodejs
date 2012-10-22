


var socket = io.connect(
"http://localhost:8100/moa_rtx"
, {secure: true}  //if true, it's https and wss.
);

socket.on("connect", function(){
	log("You connected~.");
});

socket.on('disconnect', function() { 
	log('You disconnected!'); 
}); 


