// logger.js 
// version: 1.1.1


var fs = require('fs');
 
var cwd = process.cwd() + '/',
	INFO = 0;
	DEBUG = 1;
	WARNING = 2;
	ERROR = 3;
	TRACE = 4;
	INIT = 6;
	type = ['INFO', 'DEBUG', 'WARNING', 'ERROR', 'TRACE', '', 'LOG_INIT'];
	colors = [38, 34, 35, 31, 32, 36, 33];
	bufferSize = 2000;
	writeSize = 1024;
 
exports.INFO = INFO;
exports.DEBUG = DEBUG;
exports.WARNING = WARNING;
exports.ERROR = ERROR;
exports.TRACE = TRACE;
 
 
function getPos() {
	try {
		throw new Error();
	} catch(e) {
		if(e.stack.split('\n')[4].split('(').length < 2)
			return "";
		var pos = e.stack.split('\n')[4].split('(')[1].split(')')[0].split(':');
		return pos[0].replace(cwd, '') + ':' + pos[1];
	}
}
 
function pad2(num) {
	return num > 9 ? num : '0' + num;
}

function getDay() {
	var t = new Date();
	return [t.getFullYear(), '-', pad2(t.getMonth() + 1) , '-', pad2(t.getDate())].join('');
}
 
function getTime() {
	var t = new Date();
	return [t.getFullYear(), '-', pad2(t.getMonth() + 1) , '-', pad2(t.getDate()), ' ',
		pad2(t.getHours()), ':', pad2(t.getMinutes()), ':', pad2(t.getSeconds())].join('');
}
 
function formatLog(log, color) {
	var tag = head = foot = '';
	if (color) {
		head = '\x1B[';
		foot = '\x1B[0m';
		tag = colors[5]+'m';
		color = colors[log.type]+'m';
	}
 
	return [log.time, 
			' [', head, color, type[log.type], foot, '] ', 
			log.msg, 
			' [', head, tag, log.pos, foot, ']'
			].join('');
}
 
exports.create = function(level, file) {
	if (!level) {
		level = INFO;
	}
	if (file) {
		var buffer = new Buffer(bufferSize);
		var pos = 0;
		var fd = fs.openSync(file, 'a');
		
		function checkFile() {
			if(!fs.existsSync(file)) 
			{
				console.log("the log file \'" + file + "\' is gone!!");
				fd = fs.openSync(file, 'a');
			}
		}
		
		process.on('exit', function(){
			console.log("on exit");
			checkFile();
			fs.writeSync(fd, buffer, 0, pos, null);
		});
		process.on('SIGINT', function () {
			console.log('Got SIGINT.');
			process.exit(0);
		});
	}
	
	function log(type, msg) {
		if (type < level){
			return;
		}
		var log = {type:type, msg:msg, time:getTime(), pos:getPos()};
		if (file) {
			if (pos >= writeSize) {
				checkFile();
				fs.writeSync(fd, buffer, 0, pos, null);
				pos = 0;
			}
			pos += buffer.write(formatLog(log) + "\r\n", pos);
		}
		else
			console.log(formatLog(log, true));
	}
	console.log(formatLog({type:INIT, pos:file, time:getTime(), msg: 'log init with level ' + type[level]}, true));
	return {
		info : function(msg) {log(INFO, msg);},
		debug : function(msg) {log(DEBUG, msg);},
		warning : function(msg) {log(WARNING, msg);},
		error : function(msg) {log(ERROR, msg);},
		trace : function(msg) {log(TRACE, msg);},
	};
}

var define = require("./define");
exports.log = exports.create(define.logConfig.level, define.logConfig.filename);

