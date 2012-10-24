// test.js


var a1 = [34, 34, 34, 34];
var a2 = [34, 34, 34, 34];

var b1 = new Buffer(a1);
var b2 = new Buffer(a2);

var xx = new Buffer(0);

var b2 = Buffer.concat([xx, b1, b2]);

console.log( b2 );


var str = b2.toString('utf8', 0, 2);
console.log(str);


