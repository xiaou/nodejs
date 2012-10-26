// auth_moa_rtx.js

var log = require('../logger').log;
var HmacSHA256 = require('../HmacSHA256');
var msgProtocal = require('./msgProtocal');


/* 判断是否已经通过认证了. 返回结果到回调函数的布尔参数. */
exports.hasAuth = function(socket, func)
{
	socket.get("_auth", function(err, isOK)
	{
		if(err != null || isOK == false || isOK == null)
			func(false);
		else
			func(true);
	});
};

/* 认证. 返回认证结果到回调函数的布尔参数. */
exports.checkAuth = function(socket, data, func)
{
	var result = HmacSHA256.hash(data.Key, msgProtocal.SecretPassphrase) === data.Auth;
	
	socket.set("_auth", result, function()
	{
		func(result);
	});
};
