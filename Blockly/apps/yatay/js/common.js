/**
 * @fileoverview 
 * @author 
 */

if (!Yatay.Common){ 
	Yatay.Common = {};
} 

/**
 * Send task to server
 */
Yatay.Common.sendTasks = function(code) {
	var values = escape(code).replace(/\./g, "%2E");
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'init', code:values},
		success: function() {
			//alert("success");
		},
		error:function() {
			//alert("failure");
		}
	});
}

/**
 * Kill all tasks running
 */
Yatay.Common.killTasks = function() {
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'kill', code:''},
		success: function(content){
			//alert("success");
		},
		error:function(){
			//alert("failure");
		}
	});
}

/**
 * Save current task
 */
Yatay.Common.saveTask = function(name, code) {
	var values = escape(code);
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'save', name:name, code:values},
		success: function(content){
			//alert("success");
		},
		error:function(){
			//alert("failure");
		}
	});
}