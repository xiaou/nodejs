// myUtil.js


(function(exports){

function pad2(num) {
	return num > 9 ? num : '0' + num;
}
 
exports.getTime = function() {
	var t = new Date();
	return [t.getFullYear(), '-', pad2(t.getMonth() + 1) , '-', pad2(t.getDate()), 
	' ', pad2(t.getHours()), ':', pad2(t.getMinutes()), ':', pad2(t.getSeconds())
	//, '.', t.getMilliseconds()
	].join('');
}

})( (function(){
	if(typeof exports === 'undefined'){
		window.myUtil = {};
		return window.myUtil;
	} else{
		return exports;
	}
})() );


