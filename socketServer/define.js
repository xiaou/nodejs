// define.js


/// this server
//
exports.serverPort = 8100;

//'namespace' of socket.io for nsHandlers.js and handler_*.js
exports.nsMoaRtx = "/moa_rtx"; 
exports.nsXXXX = "/xxxx";

// auth timeout. seconds.
exports.authTimeOut = 60;

// socket server and client notification name
exports.notiAuth = "auth"; 
exports.notiMessage = "message"; 


/// rtx client
//
// rtx server ip
exports.rtxServerLocation = "http://127.0.0.1:8089/rtx";

// rtx server and client notification name
exports.notiRtxMessage = "rtxMessage";

// connect Interval when disconnect. seconds.
exports.rtxConnectInterval = 10;
