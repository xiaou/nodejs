
var socket = io.connect(
"https://localhost:8100/moa_rtx"
);

var timer;

socket.on("connect", function(){
	log("You connected~.");
	
	//send auth msg.
	var id4UserPage = 'allanchen_page1';
	socket.emit(msgProtocal.moa_rtx.auth, 
	{
		Auth: HmacSHA256.hash(id4UserPage, msgProtocal.SecretPassphrase),
		Key: id4UserPage,
		Value:
		{
			MsgId: '{62A029CB-6046-45A9-9665-F75B518F991E}', 
			UserName: 'allanchen'
		}
	}
	);
});

//recv auth result.
socket.on(msgProtocal.moa_rtx.auth, function(data){
	if(data === true)
	{
		log("auth success~");
		socket.emit(msgProtocal.moa_rtx.message, "this is test data sending by MOA client");
		timer = setInterval('testClosing()', 20 * 1000);
	}
	else
		log("auth faild!!");
});

function testClosing(){
	clearInterval(timer);
	socket.disconnect();
}

socket.on(msgProtocal.moa_rtx.message, function(data){
	console.log(data);
});

socket.on('disconnect', function() { 
	log('You disconnected!'); 
}); 


