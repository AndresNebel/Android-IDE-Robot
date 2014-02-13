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
 * Initialize Yatay on load
 */
$(window).load(function() {
	Yatay.Tablet.addStyleToBlocklyToolbox();
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
 * Initialize Yatay on ready
 */
$(document).ready(function() {	
	$('#main_menu').load('./tablet.html', Yatay.Tablet.loadDialogs);
	
	var list = $('<ul class="nav" id="bx_list"></ul>');
	list.appendTo($('#behaviours_popup'));
	
	//Yatay.Common.setCookie('idUser', '', 1);
	if (Yatay.Common.getCookie("idUser") == '') { 
		requestUserId();
	}

	Yatay.Tablet.fixConflicts();
});

/**
 * Load all dialogs (multilanguage)
 */
Yatay.Tablet.loadDialogs = function() {
	$('#btn_robotest').attr('title', Yatay.Msg.MENU_ROBOTEST);
	$('#btn_debug').attr('title', Yatay.Msg.MENU_DEBUG);
	$('#btn_run').attr('title', Yatay.Msg.MENU_RUN);
	$('#btn_edit').attr('title', Yatay.Msg.MENU_EDIT);
	$('#btn_load').attr('title', Yatay.Msg.MENU_LOAD);
	$('#btn_save').attr('title', Yatay.Msg.MENU_SAVE);
	$('#btn_stop').attr('title', Yatay.Msg.MENU_STOP);
	$('#btn_trash').attr('title', Yatay.Msg.MENU_TRASH);
	$('#btn_bx_ready').attr('title', Yatay.Msg.MENU_BEHAVIOURS_READY);
	$('#code_label').html(Yatay.Msg.DIALOG_CODE_LABEL);
	$('#btn_save2').html(Yatay.Msg.MENU_SAVE);
	$('#btn_run2').html(Yatay.Msg.DIALOG_RUN);
	$('#btn_openfile').html(Yatay.Msg.DIALOG_OPEN);
	$('#loader_label').html(Yatay.Msg.DIALOG_LOADER_LABEL);	
	$('#txt_local_input').html(Yatay.Msg.DIALOG_LOCAL_INPUT);
	$('#txt_remote_input').html(Yatay.Msg.DIALOG_REMOTE_INPUT);
	$('#btn_remote_loader').before(Yatay.Msg.DIALOG_TXT_REMOTE_INPUT);
	$('#btn_remote_loader').html(Yatay.Msg.DIALOG_REMOTE_LOADER);
	$('#projmanager_label').html(Yatay.Msg.DIALOG_PROJMANAGER_LABEL);
	$('#txt_new_proj').html(Yatay.Msg.DIALOG_NEW_PROJ);
	$('#proj_input').before(Yatay.Msg.DIALOG_PROJ_NAME);
	$('#txt_remote_proj').html(Yatay.Msg.DIALOG_REMOTE_PROJ);
	$('#btn_remote_proj').before(Yatay.Msg.DIALOG_TXT_REMOTE_PROJ);
	$('#btn_remote_proj').html(Yatay.Msg.DIALOG_REMOTE_LOADER);	
	$('#btn_openproj').html(Yatay.Msg.DIALOG_START);
	$('#btn_delete_all').html(Yatay.Msg.DIALOG_DELETE_ALL);
	$('#btn_delete_workspace').html(Yatay.Msg.DIALOG_DELETE_WORKSPACE);
	$('#delete_label').html(Yatay.Msg.DIALOG_DELETE_LABEL);
};

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

	if (Yatay.Tablet.behaviours.length>0){
		var tabs = '';
		Yatay.variables = new Array();
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

		$('#code_modal').modal({backdrop:'static'});

		$('#code_modal').on('shown.bs.modal', function() {
			Yatay.Tablet.editor.refresh();
		});
	}
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
		$('#code_modal').modal('hide');
	}

	runTasks();
};	

/**
 * Handle save edited code
 */
Yatay.Tablet.saveEditedCode = function() {
	var text = '';
	for (var i=0; i<Yatay.Tablet.editedBxs.length; i++) {
		text += '-- Block: ' + Yatay.Tablet.behaviours[i][2] + '\n';
		text += Yatay.Tablet.editedBxs[i] + '\n';
	}	
	
	if (text != '') {
		var nua = navigator.userAgent;
		var is_android_browser = ((nua.indexOf('Mozilla/5.0') > -1 && (nua.indexOf('Mobile') > -1 || nua.indexOf('Android') > -1) && 			nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

		if (is_android_browser){
			Yatay.Common.saveTempLocal(escape(text).replace(/\./g, "%2E").replace(/\*/g,"%2A").replace(/\+/,"%2B"), true);
		} else {	
			var blob = new Blob([text], {type: "text/lua;charset=utf-8"});
			saveAs(blob, Yatay.Msg.FILE_CODE + ".lua");
		}
	}
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
		$('#btn_trash').toggle('slow');
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
				"         M.task = sched.sigrun({'TestsMayNowRun'}, run)\n" +
				"end\n"+
				"return M\n";
				Yatay.Common.testRobot(testTask);
				pollResults();
			}
		} else {
			Blockly.mainWorkspace.maxBlocks = 0;
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
					Yatay.variables = new Array();
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
	Blockly.mainWorkspace.maxBlocks = 0;
	if (Blockly.mainWorkspace.getAllBlocks().length > 0) {
		bxReady()
	}

	var codes = new Array();
	Yatay.variables = new Array();
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
	Blockly.mainWorkspace.maxBlocks = 'Infinity';
	//Has behaviours code been edited?
	if (Yatay.Tablet.editedBxs.active != -1) {

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
	if(!$('#btn_trash').is(":visible")) {			
		$('#btn_trash').toggle('slow');
	}
	$('#btn_stop').toggle('slow');
	$('#btn_bx_ready').toggle('slow');	
	Yatay.DebugMode = false;
	for (var j=0; j < Blockly.mainWorkspace.getAllBlocks().length; j++)
	{

		Blockly.mainWorkspace.getAllBlocks()[j].setEditable(true);
		var blockType = Blockly.mainWorkspace.getAllBlocks()[j].type;
		if (blockType != "controls_behaviourTrigger"
			 && blockType != "controls_behaviour" && blockType != "controls_conditionalBehaviour")
			Blockly.mainWorkspace.getAllBlocks()[j].setMovable(true);
		

	}
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

/**
 * Set behaviour as ready
 */
function bxReady() {
	if (Blockly.mainWorkspace.getAllBlocks()[0] != undefined) {
		if (Blockly.mainWorkspace.getAllBlocks()[0].type == "controls_behaviour" || 
		    Blockly.mainWorkspace.getAllBlocks()[0].type == "controls_conditionalBehaviour") {	
			Yatay.variables = new Array();
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
			//Disabling missing sensors
			for (var j=0; j < Blockly.mainWorkspace.getAllBlocks().length; j++)
			{
				if (Yatay.DebugMode)
				{
					Blockly.mainWorkspace.getAllBlocks()[j].setEditable(false);
					Blockly.mainWorkspace.getAllBlocks()[j].setMovable(false);
				}
				else
				{
					Blockly.mainWorkspace.getAllBlocks()[j].setEditable(true);
					var blockType = Blockly.mainWorkspace.getAllBlocks()[j].type;
					if (blockType != "controls_behaviourTrigger"
						 && blockType != "controls_behaviour" && blockType != "controls_conditionalBehaviour")
					Blockly.mainWorkspace.getAllBlocks()[j].setMovable(true);
				}
				if (Yatay.missing_sensors.indexOf(Blockly.mainWorkspace.getAllBlocks()[j].type) != -1)
					Blockly.mainWorkspace.getAllBlocks()[j].setDisabled(true);
				else if (Blockly.mainWorkspace.getAllBlocks()[j].disabled)
					Blockly.mainWorkspace.getAllBlocks()[j].setDisabled(false);
				
			}

		}
	}
	if (Yatay.Tablet.behaviours.length == 0) {
		$("#behaviours_popup").hide();
	}
	setTimeout(function() {
		var topM = Math.round(Blockly.mainWorkspace.getMetrics().viewTop);
		var leftM = Math.round(Blockly.mainWorkspace.getMetrics().viewLeft);
		Blockly.mainWorkspace.getTopBlocks()[0].setDragging_(true);
		var blockPos = Blockly.mainWorkspace.getTopBlocks()[0].getRelativeToSurfaceXY();
		Blockly.mainWorkspace.getTopBlocks()[0].moveBy(leftM - blockPos.x +15, topM - blockPos.y +15);
		Blockly.mainWorkspace.getTopBlocks()[0].setDragging_(false);
		Blockly.mainWorkspace.getTopBlocks()[0].select();
	}
	, 100)

};

Yatay.Tablet.addStyleToBlocklyToolbox = function() {
	$(".blocklyTreeRow").css('border-bottom-right-radius', '15px');	
	$(".blocklyTreeRow").css('border-bottom', '1px solid white');	
	$(".blocklyTreeRow").css('height', '35px');	
	$(".blocklyToolboxDiv div[role='treeitem']")[5].style.color = "#CF3F6F";
	$(".blocklyToolboxDiv div[role='treeitem']")[4].style.color = "darkviolet";		
	$(".blocklyToolboxDiv div[role='treeitem']")[3].style.color = "tomato";	
	$(".blocklyToolboxDiv div[role='treeitem']")[2].style.color = "green";	
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

/**
 * Function to solve conflicts betweet libraries.
 */
Yatay.Tablet.fixConflicts = function() {
	//Fix: Blockly vs Bootstrap touch events conflict on Chrome.
	Blockly.bindEvent_ = function(a,b,c,d){ 
		Blockly.bindEvent_.TOUCH_MAP = {
			mousedown:"touchstart",
			mousemove:"touchmove",
			mouseup:"touchend"
		};	
		var e=[],f; 
		if(!a.addEventListener)
			throw"Element is not a DOM node with addEventListener.";
		
		f = function(a) { 
			d.apply(c,arguments)
		};
		
		a.addEventListener(b,f,!1);
		e.push([a,b,f]);
		b in Blockly.bindEvent_.TOUCH_MAP && ( 
			f=function(a) { 
				if(1==a.changedTouches.length) { 
					var b=a.changedTouches[0];
					a.clientX=b.clientX;
					a.clientY=b.clientY
				}
				d.apply(c,arguments);
				//This line solves the conflict.
				if (a.target.ownerSVGElement != undefined) {
					a.preventDefault();
				}
			}
			, a.addEventListener(Blockly.bindEvent_.TOUCH_MAP[b],f,!1)
			, e.push([a,Blockly.bindEvent_.TOUCH_MAP[b],f]));
		return e
	};
	
	//Fix: Blocks superposition
	$('textarea').keydown(resizeTextarea).keyup(resizeTextarea).change(resizeTextarea).focus(resizeTextarea);
};
