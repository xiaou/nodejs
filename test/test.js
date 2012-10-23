// test.js


var fn = function(){
	this.UDebug = true;
	
	this.send = function(){
		console.log("send~");
	}
	
	return this;
}(); 

console.log(fn.UDebug);

fn.send();

if(fn.UDebug)
	console.log("true");

	
