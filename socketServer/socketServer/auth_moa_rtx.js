// auth_moa_rtx.js


/* 判断是否已经通过认证了. 返回结果到回调函数的布尔参数. */
exports.hasAuth = function(socket, func)
{
	socket.get("auth", function(err, isOK)
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
		//....
		result = true;
	}
	
	socket.set("auth", result, function()
	{
		func(result);
	});
};
