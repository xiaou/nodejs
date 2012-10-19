// test.js



function func()
{
	this.send = function(){
		console.log("xx");
	}
	
	return this;
}

func().send();

