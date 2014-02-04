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
 * Edited Behaviours  
 * @type {[[int, string]]}
 */
Yatay.Tablet.editedBxs = []; 

/**
 * Active edited Behaviours  
 * @type {[int]}
 */
Yatay.Tablet.editedBxs.active = -1; 

/**
 * Test mode status
 * @type {[bool]}
 */
Yatay.Tablet.testMode = false;

/**
 * CodeMirror Editor
 * @type {[Object]}
 */
Yatay.Tablet.editor = undefined;

/**
 * Load tablet.html 
 * Generate behaviours list
 */
$(document).ready(function(){	   
	$('body').bind('touchmove', function(e){e.preventDefault()});
	$('#main_menu').load('./tablet.html');	
	
	var list = $('<ul class="nav" id="bx_list"></ul>');
	list.appendTo($('#behaviours_popup'));
	
	//Yatay.Common.setCookie('idUser', '', 1);
	if (Yatay.Common.getCookie("idUser") == '') { 
		requestUserId();
	}
});

/**
 * onLoad
 */
$(window).load(function() {
	addStyleToBlocklyToolbox();
	//Mystical fix for the blockly-bootstrap scrollbar conflict
	$("foreignObject img").css("max-width","none");
	//Restoring browser persistance of blocks
	if (localStorage.yatay_bxs != null && localStorage.yatay_bxs != "") {
		var behaviours = JSON.parse(localStorage.yatay_bxs);
		for(var j=0; j< behaviours.length; j++) {
			if (Blockly.mainWorkspace.getAllBlocks().length > 0) {
				bxReady();
			}
			var code = Blockly.Xml.textToDom(behaviours[j][1]);
			Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, code);			
		}
		bxReady();
	}
});

/**
 * Handle code edited tabs switch 
 */
Yatay.Tablet.switchTabs = function(selected) {	
	if (Yatay.Tablet.editedBxs.active != -1) {
		$('#tab' + Yatay.Tablet.editedBxs.active).removeClass('active');
		Yatay.Tablet.editedBxs[Yatay.Tablet.editedBxs.active] = Yatay.Tablet.editor.getValue();
	}

	Yatay.Tablet.editor.setValue(Yatay.Tablet.editedBxs[selected.id]);
	
	$('#tab' + selected.id).addClass('active');
	Yatay.Tablet.editedBxs.active = selected.id;

	$('#code_modal').on('shown.bs.modal', function() {
		Yatay.Tablet.editor.refresh();
	});
};

/**
 * Handle hide edition modal
 */
Yatay.Tablet.closeEditor = function() {
	Yatay.Tablet.editedBxs.active = -1; 
	$('body').bind('touchmove', function(e){e.preventDefault()});
};

/**
 * Handle edit code click
 */
Yatay.Tablet.edit = function() {
	Yatay.Tablet.editedBxs = [];
	Yatay.Tablet.editedBxs.active = -1;

	if (Blockly.mainWorkspace.getAllBlocks().length>0) {
		bxReady()
	}

	var tabs = '';
	for (var i=0; i<Yatay.Tablet.behaviours.length; i++) {
		var codeXml = Blockly.Xml.textToDom(Yatay.Tablet.behaviours[i][1]);	
		Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, codeXml);
		Yatay.Tablet.editedBxs[i] = Blockly.Lua.workspaceToCode();
		Blockly.mainWorkspace.clear();
		tabs += '<li id="tab'+i+'"><a id="'+i+'" onClick="Yatay.Tablet.switchTabs(this)" href="#">'+Yatay.Tablet.behaviours[i][2]+'</a></li>'	
	}
	$('#modal_tabs').html(tabs);

	$('#tab0').addClass('active');
	Yatay.Tablet.editedBxs.active = 0;

	if (Yatay.Tablet.editor == undefined) {
		Yatay.Tablet.editor = CodeMirror.fromTextArea($('#code_editable')[0], { tabMode: "indent", matchBrackets: true, theme: "neat" });
	}	
	Yatay.Tablet.editor.setValue(Yatay.Tablet.editedBxs[0]);

	$('body').unbind('touchmove');
	$('#code_modal').modal({backdrop:'static'});

	$('#code_modal').on('shown.bs.modal', function() {
		Yatay.Tablet.editor.refresh();
	});
};

/**
 * Handle run edited code
 */
Yatay.Tablet.runEditedTasks = function() {
	var selected = [];
	selected.id = Yatay.Tablet.editedBxs.active;
	Yatay.Tablet.switchTabs(selected);

	//Has behaviours code been edited?
	if (Yatay.Tablet.editedBxs.active != -1) {
		$('body').bind('touchmove', function(e){e.preventDefault()});
		$('#code_modal').modal('hide');
	}

	runTasks();
};	

/**
 * Handle run click
 */
function runTasks() {
	if ($('#btn_stop').css('display') == 'none') {
		$('#btn_robotest').toggle('slow');
		if (Yatay.Tablet.editedBxs.active == -1) {
			$('#btn_debug').toggle('slow');	   
		}
		$('#btn_bx_ready').toggle('slow');
		$('#btn_load').toggle('slow');
		$('#btn_save').toggle('slow');		
		if($('#btn_edit').is(":visible")) {			
			$('#btn_edit').toggle('slow');
		}
		$('#btn_stop').toggle('slow');
	} else {
		if (Yatay.Tablet.testMode) {
			if (Blockly.mainWorkspace.getAllBlocks().length >0) {
				var testTask = "" +
				"local M = {}\n" +                        
				"local robot = require 'tasks/RobotInterface'\n" +
				"local sched = require 'sched'\n" +
				"local run = function ()\n" +
					 Blockly.Lua.workspaceToCode() +
				"end\n"+
				"M.init = function(conf)\n" +
				"         local waitRun = {emitter='*', events={'TestsMayNowRun'}}\n" +
				"         M.task = sched.sigrun(waitRun, run)\n" +
				"end\n"+
				"return M\n";
				Yatay.Common.testRobot(testTask);
				pollResults();
			}
		} else {
			if (Blockly.mainWorkspace.getAllBlocks().length>0) {
				bxReady()
			}

			var codes = new Array();
			for (var i = 0; i < Yatay.Tablet.behaviours.length; i++) {
				var code = '';
				//Has behaviours code been edited?
				if (Yatay.Tablet.editedBxs.active != -1) {
					code = Yatay.Tablet.editedBxs[i];
				} else {
					var codeXML = Blockly.Xml.textToDom(Yatay.Tablet.behaviours[i][1]);        
					Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, codeXML);
					code = Blockly.Lua.workspaceToCode();
				}
				codes.push(code);
				Blockly.mainWorkspace.clear();
			}		

			for (var i = 0; i < codes.length; i++) {
				Yatay.Common.sendTasks(codes[i]);
			}
			pollResults();
		}
	}
};

/**
 * Handle debug click
 */
function debug(){		
	Yatay.DebugBlockIdOffset = 0;
	Yatay.DebugMode = true;   

	if (Blockly.mainWorkspace.getAllBlocks().length > 0) {
		bxReady()
	}

	var codes = new Array();
	for (var i = 0; i < Yatay.Tablet.behaviours.length; i++) {	
		var codeXML = Blockly.Xml.textToDom(Yatay.Tablet.behaviours[i][1]);        
		Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, codeXML);
		var code = Blockly.Lua.workspaceToCode();
		codes.push(code);
		Yatay.DebugBlockIdOffset += Blockly.mainWorkspace.getAllBlocks().length;
		Blockly.mainWorkspace.clear();
	}		

	for (var i = 0; i < codes.length; i++) {
		Yatay.Common.sendTasks(codes[i]);
	}

	pollResults();
	debugPoll();
};

/**
 * Handle stop click
 */
function stop(){	
	//Has behaviours code been edited?
	if (Yatay.Tablet.editedBxs.active != -1) {
		$('body').unbind('touchmove');
		$('#code_modal').modal({	backdrop:'static' });
	}

	if (Yatay.Tablet.testMode) {
		if (Yatay.Tablet.behaviours.length > 0) {
			$("#behaviours_popup").show();
		}
		Yatay.Tablet.testMode = false;
		Yatay.Common.killTasks();
		Yatay.leaveTestMode();
	} else {
		Yatay.DebugBlockIdOffset = 0;
		Yatay.Common.killTasks();
		if (Yatay.Tablet.editedBxs.active == -1) {
			$('#btn_debug').toggle('slow');	   
		}	   
	}
	$('#btn_robotest').toggle('slow');		
	$('#btn_edit').toggle('slow');
	$('#btn_load').toggle('slow');
	$('#btn_save').toggle('slow');
	$('#btn_stop').toggle('slow');
	$('#btn_bx_ready').toggle('slow');	
	Yatay.DebugMode = false;
};

/**
 * Handle robotest click
 */
function robotest(){	
	try {	
		bxReady();
	} catch(e) {}

	$("#behaviours_popup").hide();

	Yatay.enterTestMode();
	Yatay.Tablet.testMode = true;

	$('#btn_robotest').toggle('slow');
	$('#btn_load').toggle('slow');
	$('#btn_save').toggle('slow');
	$('#btn_bx_ready').toggle('slow');
	if($('#btn_edit').is(":visible")) {			
		$('#btn_edit').toggle('slow');
	}
	$('#btn_stop').toggle();
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
 * Image click correction
 */
function imgClickCorrection() {
	$(".imgclick").mousedown(function(){
		var mrgtb = parseInt($(this).css("margin-top"));
		var mrglf = parseInt($(this).css("margin-left"));
		mrgtb=mrgtb+1; mrglf=mrglf+1;
		$(this).css("margin-top",mrgtb+"px").css("margin-left",mrglf+"px");
	}).mouseup(function(){
		var mrgtb = parseInt($(this).css("margin-top"));
		var mrglf = parseInt($(this).css("margin-left"));
		mrgtb=mrgtb-1; mrglf=mrglf-1;
		$(this).css("margin-top",mrgtb+"px").css("margin-left",mrglf+"px");
	}); 
};

/**
 * Set behaviour as ready
 */
function bxReady() {
	if (Blockly.mainWorkspace.getAllBlocks()[0] != undefined) {
		if (Blockly.mainWorkspace.getAllBlocks()[0].type == "controls_behaviour" || 
		    Blockly.mainWorkspace.getAllBlocks()[0].type == "controls_conditionalBehaviour") {	
			var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
			var text = Blockly.Xml.domToText(xml);
			var name = Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].getValue();
			var size = Blockly.mainWorkspace.getAllBlocks().length;
			if (name.length > 13) {
				name = name.substring(0, 12) + "...";
			}
			var id = Blockly.mainWorkspace.getAllBlocks()[0].id;
			Yatay.Tablet.behaviours.push([id, text, name, size]);
					
			var list = $("<li style=\"display:none;\">" +
						"<div id=\"" + id + "\" class=\"image-container\">" +
							"<div class=\"image-inner-container\">" +
								"<p class=\"overlay\">" + name + "</p>" + Yatay.Msg.SVG_BEHAVIOURS +
							"</div>" +
						"</div>" +
					 "</li>");	
			$("#behaviours_popup").show();
			list.appendTo($("#bx_list")).slideDown("slow");	
			document.getElementById(id).onclick = bxToWorkspace;
			Blockly.mainWorkspace.clear();
		}
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
	if (Yatay.Tablet.behaviours.length == 0) {
		$("#behaviours_popup").hide();
	}
};

function addStyleToBlocklyToolbox() {
	$(".blocklyTreeRow").css('border-bottom-right-radius', '15px');	
	$(".blocklyTreeRow").css('border-bottom', '1px solid white');	
	$(".blocklyTreeRow").css('height', '35px');	
	$(".blocklyToolboxDiv div[role='treeitem']")[5].style.color = "#CF3F6F";	
	$(".blocklyToolboxDiv div[role='treeitem']")[3].style.color = "tomato";	
	$(".blocklyToolboxDiv div[role='treeitem']")[4].style.color = "green";	
	$(".blocklyToolboxDiv div[role='treeitem']")[2].style.color = "darkviolet";	
	$(".blocklyToolboxDiv div[role='treeitem']")[1].style.color = "darkred";	
	$(".blocklyToolboxDiv div[role='treeitem']")[0].style.color = 'royalblue';
}

/**
 * Initialize and start the tour
 */
Yatay.Tablet.takeTour = function() {
	$('.blocklyToolboxDiv').addClass('bootstro');
	$('.blocklyToolboxDiv').attr('data-bootstro-step', '0');
	$('.blocklyToolboxDiv').attr('data-bootstro-width', '600px');
	$('.blocklyToolboxDiv').attr('data-bootstro-placement', 'right');
	$('.blocklyToolboxDiv').attr('data-bootstro-title', Yatay.Msg.TOUR_TOOLBOX_TITLE);
	$('.blocklyToolboxDiv').attr('data-bootstro-content', Yatay.Msg.TOUR_TOOLBOX_CONTENT);

	$('#btn_robotest').addClass('bootstro');
	$('#btn_robotest').attr('data-bootstro-step', '1');
	$('#btn_robotest').attr('data-bootstro-width', '400px');
	$('#btn_robotest').attr('data-bootstro-placement', 'right');
	$('#btn_robotest').attr('data-bootstro-title', Yatay.Msg.TOUR_RBTEST_TITLE);
	$('#btn_robotest').attr('data-bootstro-content', Yatay.Msg.TOUR_RBTEST_CONTENT);

	$('#btn_run').addClass('bootstro');
	$('#btn_run').attr('data-bootstro-step', '2');
	$('#btn_run').attr('data-bootstro-width', '600px');
	$('#btn_run').attr('data-bootstro-placement', 'right');
	$('#btn_run').attr('data-bootstro-title', Yatay.Msg.TOUR_RUN_TITLE);
	$('#btn_run').attr('data-bootstro-content', Yatay.Msg.TOUR_RUN_CONTENT);

	$('#btn_bx_ready').addClass('bootstro');
	$('#btn_bx_ready').attr('data-bootstro-step', '3');
	$('#btn_bx_ready').attr('data-bootstro-width', '400px');
	$('#btn_bx_ready').attr('data-bootstro-placement', 'right');
	$('#btn_bx_ready').attr('data-bootstro-title', Yatay.Msg.TOUR_BXREADY_TITLE);
	$('#btn_bx_ready').attr('data-bootstro-content', Yatay.Msg.TOUR_BXREADY_CONTENT);

	$('#btn_edit').addClass('bootstro');
	$('#btn_edit').attr('data-bootstro-step', '4');
	$('#btn_edit').attr('data-bootstro-width', '400px');
	$('#btn_edit').attr('data-bootstro-placement', 'right');
	$('#btn_edit').attr('data-bootstro-title', Yatay.Msg.TOUR_EDIT_TITLE);
	$('#btn_edit').attr('data-bootstro-content', Yatay.Msg.TOUR_EDIT_CONTENT);

	bootstro.start('.bootstro', {
		nextButton: '<button class="btn btn-primary btn-mini bootstro-next-btn">'+ Yatay.Msg.TOUR_NEXT +'</button>',
		prevButton: '<button class="btn btn-primary btn-mini bootstro-prev-btn">'+ Yatay.Msg.TOUR_PREV +'</button>',
		finishButton: ''
	});
};
