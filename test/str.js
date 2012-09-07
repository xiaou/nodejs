// str.js


buf = new Buffer(256);
len = buf.write('abcd XX', 0);
console.log(buf.length);
console.log(Buffer.byteLength(buf.toString('utf8', 0, len), 'utf8'));
console.log(len + " bytes:" + '[' + buf.toString('utf8', 0, len) + "]");


