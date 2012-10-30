// func.js

var client = function(){
	this.isConnected;
	this.socket;
	this.timer = 1;
	this._cbRecvDataFunc;
	

	return this;
}();

var f = function(){};
console.log(f);
client.timer = 2;



