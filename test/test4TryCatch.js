// test.js

var util = require('util');

var arr = [0, 1, 2, 3];
arr.push(4);
console.log(arr.length);
arr[arr.length - 1] ++;
console.log(arr);

var o = {a: 'b', c: 'd'};
//var o = util.format("%j", o);
console.log(o);

try{
	try{
		var obj = JSON.parse(o);
		console.log(obj.a);
	}
	catch(e){
		console.log("catched! " + e);
		//throw {x: 'y'};
		//throw new Buffer(4);
		throw new Error("----");
	}
}
catch(e){
	console.log(e);
	console.log(e.name + " > " + e.message);
	console.log( util.format("%s", e ) );
}


console.log("end~");
