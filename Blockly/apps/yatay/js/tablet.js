//Java Script to load tablet resources 
$(document).ready(function(){	   
	$('#main_menu').load('./tablet.html');	
	//Hack para ue me muestre los bloques previamente agregados.
	Blockly.mainWorkspace.render();
});
//Handle docode click
function docode(){	
	$('#code_editable').html(Blockly.Lua.workspaceToCode());
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