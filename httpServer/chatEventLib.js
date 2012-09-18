// chatEventLib.js

(function(exports){

/*

JSON eg:

{
type: "INFO",
data: "welcom to the chat~",
time: "2012-9-18 14:40:32"
}

{
type: "NAME",
data: "myNewName",
time: "2012-9-18 14:40:32"
}

{
type: "SAY",
user: "xiaoU",
data: "hello~",
time: "2012-9-18 14:40:32"
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


