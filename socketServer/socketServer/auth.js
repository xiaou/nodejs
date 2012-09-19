// auth.js


var define = require("../define");


/* 判断是否已经通过认证了. 返回结果到回调函数的布尔参数. */
exports.hasAuth = function(socket, func)
{
	socket.get(define.kAuth, function(err, isOK)
	{
		if(err || isOK == false)
			func(false);
		else
			func(true);
	});
};

/* 认证. 返回认证结果到回调函数的布尔参数. */
exports.checkAuth = function(socket, data, func)
{
	var result = false;
	
	if(1/*check data for auth.*/)
	{//passed the check
		result = true;
	}
	
	socket.set(define.kAuth, result, function()
	{
		func(result);
	});
};
