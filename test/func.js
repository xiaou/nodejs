// func.js


exports.Client = function() 
{
	console.log("构造");

	this.send = function(){
		console.log("see");
	}
	
	return this;
}

