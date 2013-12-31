/**
 * @fileoverview 
 * @author 
 */

if (!Yatay.Tablet){ 
	Yatay.Tablet = {};
} 
 
/**
 * Behaviours ready 
 * @type {[[int, string]]}
 */
Yatay.Tablet.behaviours = []; 

/**
 * Test mode status
 * @type {bool}
 */
Yatay.Tablet.testMode = false;

/**
 * Load tablet.html 
 * Generate behaviours list
 */
$(document).ready(function(){	   
	$('#main_menu').load('./tablet.html');	
	
	var list = $("<div class=\"list-group bx\">" +
					"<ul class=\"nav\" id=\"bx_list\">" + 
					"</ul>" +
				"</div>");
	list.appendTo($("#bx_ready"));
});

/**
 * Handle run click
 */
function runTasks(){	
	Yatay.Common.sendTasks(Blockly.Lua.workspaceToCode());
	$('#btn_robotest').toggle('slow');
	$('#btn_debug').toggle('slow');	   
	$('#btn_run').toggle('slow');			
	$('#btn_load').toggle('slow');
	$('#btn_save').toggle('slow');		
	$('#btn_bx_ready').toggle('slow');
	$('#btn_trash').toggle('slow');
	if($('#btn_edit').is(":visible")) {			
		$('#btn_edit').toggle('slow');
	}
	$('#btn_stop').toggle('slow');
};

/**
 * Handle debug click
 */
function debug(){		   
	sendTasks(Blockly.Lua.workspaceToCode());
	$('#btn_robotest').toggle('slow');
	$('#btn_debug').toggle('slow');	   
	$('#btn_run').toggle('slow');			
	$('#btn_load').toggle('slow');
	$('#btn_save').toggle('slow');
	$('#btn_bx_ready').toggle('slow');
	$('#btn_trash').toggle('slow');
	if($('#btn_edit').is(":visible")) {			
		$('#btn_edit').toggle('slow');
	}
	$('#btn_stop').toggle();
};

/**
 * Handle stop click
 */
function stop(){	
	if (Yatay.Tablet.testMode) {
		$("#bx_ready").show();
		Yatay.Tablet.testMode = false;
		Yatay.leaveTestMode();
	} else {
		Yatay.Common.killTasks();
		$('#btn_debug').toggle('slow');	   
		$('#btn_run').toggle('slow');		
	}
	$('#btn_robotest').toggle('slow');		
	$('#btn_edit').toggle('slow');
	$('#btn_load').toggle('slow');
	$('#btn_save').toggle('slow');
	$('#btn_stop').toggle('slow');
	$('#btn_bx_ready').toggle('slow');	
	$('#btn_trash').toggle('slow');
};

/**
 * Handle robotest click
 */
function robotest(){	
	try
	{	
		bxReady();
	}
	catch(e){}
	$("#bx_ready").hide();
	Yatay.enterTestMode();
	Yatay.Tablet.testMode = true;
	$('#btn_robotest').toggle('slow');
	$('#btn_load').toggle('slow');
	$('#btn_save').toggle('slow');
	$('#btn_bx_ready').toggle('slow');
	$('#btn_trash').toggle('slow');
	if($('#btn_edit').is(":visible")) {			
		$('#btn_edit').toggle('slow');
	}
	$('#btn_stop').toggle();
};

/**
 * Handle run task edited click
 */
function runEdited(){	
	sendTasksEdited($("#code_editable").val());
	$('#btn_robotest').toggle('slow');
	$('#btn_debug').toggle('slow');	   
	$('#btn_run').toggle('slow');			
	$('#btn_load').toggle('slow');
	$('#btn_save').toggle('slow');		
	if($('#btn_edit').is(":visible")) {			
		$('#btn_edit').toggle('slow');
	}
	$('#btn_stop').toggle('slow');
	$('#code_modal').modal('hide');
};

/**
 * Textarea autoresize
 */
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

/**
 * Set behaviour as ready
 */
function bxReady() {
	if (Blockly.mainWorkspace.getAllBlocks()[0].type == "controls_behaviour")
	{
		var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
		var text = Blockly.Xml.domToText(xml);
		var name = Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].text_;
		if (name.length > 15) {
			name = name.substring(0, 14) + "...";
		}
		var id = Blockly.mainWorkspace.getAllBlocks()[0].id;
		Yatay.Tablet.behaviours.push([id, text]);
					
		var list = $("<li>" +
						"<div id=\"" + id + "\" class=\"image-container\">" +
							"<div class=\"image-inner-container\">" +
								"<p class=\"overlay\">" + name + "</p>" +                                
								"<img src=\"images/bx.png\" />" +
							"</div>" +
						"</div>" +
					 "</li>");
		list.appendTo($("#bx_list"));
		
		document.getElementById(id).onclick = bxToWorkspace;
		Blockly.mainWorkspace.clear();
	}
};

/**
 * Draw selected behaviour to workspace
 */
function bxToWorkspace() {
	for (i = 0; i < Yatay.Tablet.behaviours.length; ++i) {
		if (Yatay.Tablet.behaviours[i][0] == this.id) {
			code = Blockly.Xml.textToDom(Yatay.Tablet.behaviours[i][1]);
			var item = "#" + this.id;
			$(item).animate({height:'toggle'}, 'slow', function () {$(item).remove()});
			Yatay.Tablet.behaviours.splice(i, 1);
			if (Blockly.mainWorkspace.getAllBlocks().length > 0) {
				bxReady();
			}
			Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, code);
		}
	}
};
