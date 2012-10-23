
var socket = io.connect(
"https://localhost:8100/moa_rtx"
);

var timer;
var counter = 0;

socket.on("connect", function(){
	log("You connected~.");
	
	//send auth msg.
	socket.emit(msgProtocal.moa_rtx.auth, 'this is the auth data of moa rtx client');
});

//recv auth result.
socket.on(msgProtocal.moa_rtx.auth, function(data){
	if(data === true)
	{
		log("auth success~");
		timer = setInterval('testSending()', 2000);
	}
	else
		log("auth faild!!");
});

function testSending(){
	socket.emit(msgProtocal.moa_rtx.message, {a: 'b', c: 'd'});
	
	log(counter++);
	if(counter === 3)
	{
		clearInterval(timer);
		counter = 0;
		socket.disconnect();
	}
}

socket.on(msgProtocal.moa_rtx.message, function(data){
	log('recv: ' + '{a: ' + data.a + ', c: ' + data.c);
});

socket.on('disconnect', function() { 
	log('You disconnected!'); 
}); 


