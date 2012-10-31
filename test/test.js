// test.js

function CC()
{
	//If don't set those property(eg: new ClientRoom()), typeof they === 'undefined'.
	Key = " It's the room of socket.io and It's Key of list send to rtx serv. ";
	Value = " It's Value that the rtx serv care. ";
}


var x = new CC;
x.Key = 1;
var y = new CC();
y.Value = 2;
console.log(x);


