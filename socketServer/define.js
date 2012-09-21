// define.js


/// this server
//
exports.serverPort = 8100;

//'namespace' of socket.io for nsHandlers.js and handler_*.js
exports.namespaces = ["/moa_rtx"]; 

// auth timeout. seconds.
exports.authTimeOut = 60;

// socket server and client notification names for moa rtx.
exports.noti4MoaRtx = {auth: "mrAuth", message: "mrMessage"};


/// rtx client
//
// rtx server ip
exports.rtxServerLocation = "http://127.0.0.1:8089/rtx";

// rtx server and client notification names
exports.noti4RtxServ = {message: "rsMessage"};

// connect Interval when disconnect. seconds.
exports.rtxServConnectInterval = 10;
