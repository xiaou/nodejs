// func.js

console.log(process.argv);


function func(args, callback)
{
	process.stdout.write("\n\tin func\n\n");
	console.log("arguments of func length:"+arguments.length);
	console.log("arg2 is:");
	process.stdout.write(arguments[1].toString());

	if(callback)
		callback();
}

func(null,
function()
{
	console.log("\n\n\tin callback\n");
}
);
