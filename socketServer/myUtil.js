// myUtil.js


(function(exports){

exports.getTime = function()
{
    var date = "";
    var jsDate = new Date();
    //date = jsDate.getFullYear()+"年"+jsDate.getMonth()+"月"+jsDate.getDay()+"日 "+jsDate.getHours()+"时"+jsDate.getMinutes()+"分"+new Date().getSeconds()+"秒";
    date = jsDate.getFullYear()+"-"+(Number(jsDate.getMonth())+1)+"-"+jsDate.getDate()+" ";
    if(jsDate.getHours()<10){
        date = date+"0"+jsDate.getHours()+":";
    }else{
        date = date+jsDate.getHours()+":";
    }
    if(jsDate.getMinutes()<10){
        date = date+"0"+jsDate.getMinutes()+":";
    }else{
        date = date+jsDate.getMinutes()+":";
    }
    if(jsDate.getSeconds()<10){
        date = date+"0"+jsDate.getSeconds()+"";
    }else{
        date = date+jsDate.getSeconds()+"";
    }//+jsDate.getMilliseconds()+"豪秒"
	return date;
};



})( (function(){
	if(typeof exports === 'undefined'){
		window.myUtil = {};
		return window.myUtil;
	} else{
		return exports;
	}
})() );



