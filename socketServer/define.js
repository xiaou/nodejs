// define.js


module.exports = function(){


/// for debug
//
this.UDebug = true;
this.EDebug = true;


/// 数据包结尾校验字节符
//
this.endByte = 3;//0x03


/// this server
//
this.isHttps = false;
//
this.serverPort = 8100;
//this.serverHost = '0.0.0.0';
this.serverHost = "10.13.64.98";
//this.serverHost = "10.66.80.66";//free wifi

//'namespace' of socket.io for nsHandlers.js and handler_*.js
this.namespaces = ["/moa_rtx"]; 

// auth timeout. seconds.
this.authTimeOut = 20;

// socket server and client notification names for moa rtx.
//this.noti4MoaRtx = {auth: "mrAuth", message: "mrMessage"};


/// rtx client
//
this.rtxServerLocation = {port: 18896, host: "10.6.11.106" };
this.rtxClientAddress = {family: 'IPv4', address: '0.0.0.0' };
this.rtxClientKeepAliveDelay = 10; /* tcp心跳包的心跳周期.秒. */

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


