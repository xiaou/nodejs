// define.js


module.exports = function(){


/// for debug
//
this.UDebug = true;
this.EDebug = true;


/// this server
//
this.serverPort = 8100;
this.serverHost = "0.0.0.0";

//'namespace' of socket.io for nsHandlers.js and handler_*.js
this.namespaces = ["/moa_rtx"]; 

// auth timeout. seconds.
this.authTimeOut = 4;

// socket server and client notification names for moa rtx.
//this.noti4MoaRtx = {auth: "mrAuth", message: "mrMessage"};


/// rtx client
//
this.rtxServerLocation = {port: 18896, host: "10.6.11.106" };
this.rtxClientAddress = {family: 'IPv4', address: '127.0.0.1' };
this.rtxClientKeepAliveDelay = 2; /* tcp心跳包的心跳周期.秒. */

// connect Interval when disconnect. seconds.
this.rtxServConnectInterval = 10;


/// log config.  see logger.js for the meaning.
//
this.logConfig = 
{
	level: 0,
	filename: 0//"log/log4rtxServClient.txt"
};

	
return this;}();


