// socket server and client notification names for moa rtx.

(function(exports){

exports.moa_rtx = {auth: 'mrAuth', message: 'mrMessage'};

exports.SecretPassphrase = 'whosyourdaddy';



})( (function(){
	if(typeof exports === 'undefined'){
		window.msgProtocal = {};
		return window.msgProtocal;
	}
	else{
		return exports;
	}
})() );

