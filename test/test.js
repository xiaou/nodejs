// test.js

function funcxx()
{
	process.stdout.write("my name is:" + this.name);	
}

console.log(funcxx.name+'\n\n');
funcxx();
