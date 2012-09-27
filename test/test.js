// test.js

var logger = require("./logger").create(0, "log1.txt");

//var logger2 = require("./logger").create(0, "log1.txt");


for(var i = 0; i != 10; i++)
{
	logger.info("see: " + i);
	//logger2.debug("see: " + i);
}

setTimeout(function(){
	console.log("time out");
}, 1000 * 10);

//while(1);


