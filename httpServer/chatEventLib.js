// chatEventLib.js

(function(exports){

/*

JSON eg:

{
type: "INFO",
data: "welcom to the chat~"
}

{
type: "NAME",
data: "myNewName"
}

{
type: "SAY",
user: "xiaoU",
data: "hello~"
}

*/

exports.CHAT_EVENT = "CHAT_EVENT";
exports.CHAT_EVENT_TYPE = 
{
	INFO: "INFO",
	NAME: "NAME",
	SAY: "SAY"
};

})( (function(){
	if(typeof exports === 'undefined'){
		window.chatEventLib = {};
		return window.chatEventLib;
	} else{
		return exports;
	}
})() );


