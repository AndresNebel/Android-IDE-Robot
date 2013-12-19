//Send tasks
function sendTasks() {
	var values = escape(Blockly.Lua.workspaceToCode()).replace(/\./g, "%2E");
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: {code:values, other:''},
		success: function() {
			alert("success");
			$("#result").html('Submitted successfully');
		},
		error:function() {
			alert("failure");
			$("#result").html('There is error while submit');
		}
	});
}	
//Send tasks edited
function sendTasksEdited() {
	var values = escape($("#code_editable").val()).replace(/\./g, "%2E");
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: {code:values, other:''},
		success: function() {
			alert("success");
			$("#result").html('Submitted successfully');
		},
		error:function() {
			alert("failure");
			$("#result").html('There is error while submit');
		}
	});
}
//Kill tasks 
function killTasks() {
	$.ajax({
		url: "/index.html",
		type: "post",
		data: {kill:'test', other:''},
		success: function(content){
			alert("success");
		},
		error:function(){
			alert("failure");
		}
	});
}