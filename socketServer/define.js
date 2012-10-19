// define.js


/// this server
//
exports.serverPort = 8100;
exports.serverHost = "0.0.0.0";

//'namespace' of socket.io for nsHandlers.js and handler_*.js
exports.namespaces = ["/moa_rtx"]; 

// auth timeout. seconds.
exports.authTimeOut = 60;

// socket server and client notification names for moa rtx.
exports.noti4MoaRtx = {auth: "mrAuth", message: "mrMessage"};


/// rtx client
//
exports.rtxServerLocation = {port: 8992, host: "10.6.11.106" };
exports.rtxClientAddress = {family: 'IPv4', address: '127.0.0.1' };
exports.rtxClientKeepAliveDelay = 10; /* tcp心跳包的心跳周期.秒. */

// connect Interval when disconnect. seconds.
exports.rtxServConnectInterval = 10;


/// log config.  see logger.js for the meaning.
//
exports.logConfig = 
{
	moa_rtx: 
	{
		level: 0,
		filename: 0//"log/log4moa_rtx.txt",
	},
	
	rtxServClient: 
	{
		level: 0,
		filename: 0//"log/log4rtxServClient.txt"
	}
};

