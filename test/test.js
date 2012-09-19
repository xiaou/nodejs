// test.js


var handle = {};
handle["k1"] = "v1";
handle["k2"] = "v2";

for(var k in handle)
{
	console.log( k + " = " + handle[k] );
}



