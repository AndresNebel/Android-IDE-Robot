//Java Script to load tablet resources 
$(document).ready(function(){	   
	$('#main_menu').load('yatay/tablet.html');	
});
//Handle docode click
function docode(){	
	$('#code_editable').html(Blockly.Generator.workspaceToCode('Lua'));
	$('#code_modal').modal('show');
};
//Handle run click
function run(){	
	sendTasks();
	$('#robotest').toggle('slow');
	$('#debug').toggle('slow');	   
	$('#run').toggle('slow');			
	$('#load').toggle('slow');
	$('#save').toggle('slow');		
	if($('#docode').is(":visible")) {			
		$('#docode').toggle('slow');
	}
	$('#stop').toggle('slow');
};
//Handle debug click
function debug(){		   
	$('#robotest').toggle('slow');
	$('#debug').toggle('slow');	   
	$('#run').toggle('slow');			
	$('#load').toggle('slow');
	$('#save').toggle('slow');
	if($('#docode').is(":visible")) {			
		$('#docode').toggle('slow');
	}
	$('#stop').toggle();
};
//Handle stop click
function stop(){	
	killTasks();
	$('#robotest').toggle('slow');
	$('#debug').toggle('slow');	   
	$('#run').toggle('slow');			
	$('#docode').toggle('slow');
	$('#load').toggle('slow');
	$('#save').toggle('slow');
	$('#stop').toggle('slow');
};
//Handle robotest click
function robotest(){		   

};
//Handle run task edited click
function runEdited(){	
	sendTasksEdited();
	$('#robotest').toggle('slow');
	$('#debug').toggle('slow');	   
	$('#run').toggle('slow');			
	$('#load').toggle('slow');
	$('#save').toggle('slow');		
	if($('#docode').is(":visible")) {			
		$('#docode').toggle('slow');
	}
	$('#stop').toggle('slow');
	$('#code_modal').modal('hide');
};
//Textarea autoresize
var resizeTextarea = function() {
    this.style.height = "";
    var
        $this = $(this),            
        outerHeight = $this.outerHeight(),
        scrollHeight = this.scrollHeight,
        innerHeight = $this.innerHeight(),
        magic = outerHeight - innerHeight;
    this.style.height = scrollHeight + magic + "px";
};

$('textarea').keydown(resizeTextarea).keyup(resizeTextarea).change(resizeTextarea).focus(resizeTextarea);
//Send tasks
function sendTasks() {
	var values = escape(Blockly.Generator.workspaceToCode('Lua')).replace(/\./g, "%2E");
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