// test.js

var util = require("util");


var arr = [1, 2, 3, 4];

console.log("arr length = " + arr.length);


if(util.isArray(arr))
	console.log("see: is array.");

var i = arr.indexOf(1, 1);
console.log("see : i = " + i);



