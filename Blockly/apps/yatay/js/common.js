/**
 * @fileoverview 
 * @author 
 */

if (!Yatay.Common){ 
	Yatay.Common = {};
}; 

/**
 * Xml workspace code of file being loaded 
 * @type {string}
 */
Yatay.Common.fileCode = ''; 

/**
 * Xml workspace code of behaviours being loaded 
 * @type {[[string, string]]}
 */
Yatay.Common.bxsCode = [];

/**
 * Selected project to be join
 * @type {string}
 */
Yatay.Common.joinProj = '';

/**
 * Selected behaviours to be load 
 * @type {[string][string]}
 */
Yatay.Common.activesBxs = [];

/**
 * Selected project to be load 
 * @type {[string]}
 */
Yatay.Common.activesProj = [];

/**
 * Behaviours ready 
 * @type {[[int, string]]}
 */
Yatay.Common.behaviours = [];

/**
 * Yatay need to refresh blocks? 
 * @type {[bool]}
 */
Yatay.Common.refresh = false;

/**
 * Edited Behaviours  
 * @type {[[int, string]]}
 */
Yatay.Common.editedBxs = []; 

/**
 * Active edited Behaviours  
 * @type {[int]}
 */
Yatay.Common.editedBxs.active = -1; 

/**
 * Test mode status
 * @type {[bool]}
 */
Yatay.Common.testMode = false;

/**
 * CodeMirror Editor
 * @type {[Object]}
 */
Yatay.Common.editor = undefined;

/**
 * Initialize Yatay on load
 */
$(window).load(function() {
	Yatay.Common.addStyleToBlocklyToolbox();
	//Mystical fix for the blockly-bootstrap scrollbar conflict
	$("foreignObject img").css("max-width","none");
	//Restoring browser persistance of blocks
	if (localStorage.yatay_bxs != null && localStorage.yatay_bxs != "") {
		var behaviours = JSON.parse(localStorage.yatay_bxs);
		for(var j=0; j< behaviours.length; j++) {
			if (Blockly.mainWorkspace.getAllBlocks().length > 0) {
				Yatay.Common.bxReady();
			}
			var code = Blockly.Xml.textToDom(behaviours[j][1]);
			Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, code);			
		}
		Yatay.Common.bxReady();
	}
	//Show Project Manager Modal (when the page is loaded)
	setTimeout(	Yatay.Common.projectChecker, 1000);
});

/**
 * Initialize (start refresh blocks poll)
 */
$(document).ready(function() {
	Yatay.Common.refreshBlocksPoll();
});

/**
 * Load all dialogs (multilanguage)
 */
Yatay.Common.loadDialogs = function() {
	$('#code_label').html(Yatay.Msg.DIALOG_CODE_LABEL);
	$('#btn_save2').html(Yatay.Msg.DIALOG_SAVE);
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
 * Bootstrap-multiselect list builder
 */ 
Yatay.Common.buildMultiSelector = function(select, selectAll) {
	selectAll = typeof selectAll != 'undefined' ? selectAll : true;
	if (selectAll) {
		var value = 'multiselect-select-all';
		select.multiselect({
			includeSelectAllOption: true,
			onChange: Yatay.Common.BxsChangeSelection,
			selectAllValue: value
		});
	} else {
		select.multiselect({
			onChange: Yatay.Common.ProjChangeSelection
		});
	}
	return false;
};

/**
 * Handle onChange of Behaviours Bootstrap-multiselect list
 */
Yatay.Common.BxsChangeSelection = function(element, checked) {
	$(".modal-body").scrollTop($(".modal-body")[0].scrollHeight);
        
	var project = element['context']['id'];
	var selected = $('#' + project).val();                

	Yatay.Common.activesBxs[project] = [];

	if (selected == null) {
		 Yatay.Common.activesProj.pop(project);
	} else {
		 for (var i=0; i < selected.length; i++) {
		         if (selected[i] != 'multiselect-select-all') {                        
		                 if (Yatay.Common.activesProj.indexOf(project) == -1) {
		                         Yatay.Common.activesProj.push(project);
		                 }
		                 if (Yatay.Common.activesBxs[project].indexOf(selected[i]) == -1) {
		                         Yatay.Common.activesBxs[project].push(selected[i]);                                
		                 }
		         }
		 }
	}
}; 

/**
 * Handle onChange of Projects Bootstrap-multiselect list
 */
Yatay.Common.ProjChangeSelection = function(element, checked) {
	$(".modal-body").scrollTop($(".modal-body")[0].scrollHeight);
	Yatay.Common.joinProj = element['context']['value'];
}; 

/**
* Opens the Delete popup
*/	
Yatay.Common.openDeleteModal = function() {
	if (Yatay.Common.testMode) {
		Blockly.mainWorkspace.clear();
		Yatay.Common.killTasks();
	}
	else
		$("#delete_modal").modal('show');
};

/**
 * Send task to server
 */
Yatay.Common.sendTasks = function(code) {
	var values = escape(code).replace(/\./g, "%2E").replace(/\*/g,"%2A").replace(/\+/,"%2B");
	var idUser = Yatay.Common.getCookie("idUser");
	if (idUser == null) {
		location.reload(); 
		return;
	}
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'init', code:values, userId: idUser},
		success: function() {
			$('#results_popup').show();
		},
		error:function() {}
	});
};

/**
 * Send Robot Test block to server
 */
Yatay.Common.testRobot = function(code) {
	var values = escape(code).replace(/\./g, "%2E").replace(/\*/g,"%2A").replace(/\+/,"%2B");
	var idUser = Yatay.Common.getCookie("idUser");
	if (idUser == null) {
		location.reload(); 
		return;
	}
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'test', code:values, userId: idUser},
		success: function() {
			$('#results_popup').show();
		},
		error:function() {}
	});
}

/**
 * Kill all tasks running
 */
Yatay.Common.killTasks = function() {
	var idUser = Yatay.Common.getCookie("idUser");
	if (idUser == null) {
		location.reload(); 
		return;
	}
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'kill', code:'', userId: idUser},
		success: function(){
			$('#results_popup').hide();
		},
		error:function(){}
	});
};

/**
 * Save current task
 */
Yatay.Common.saveTask = function(block, code) {
	var values = escape(code).replace(/\./g, "%2E").replace(/\*/g,"%2A").replace(/\+/,"%2B");
	var project = Yatay.Common.getCookie('project_name');
	var newborn = (Yatay.Common.getCookie(project+'_'+block) != '') ? false : true;

	if (project != '' && values != '') {
		$.ajax({
			url: "/index.html",
			type: "POST",
			data: { id:'save', newborn:newborn, project:project, block:block, code:values }, 
			success: function(content){
				if (content.length > 0) {
					if (newborn) {
						Yatay.Common.setCookie(project+'_'+content, content, 1);
						if (block != content) {
							Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].setValue(content);
						}
					}
				}		
			},
			error:function(){}
		});
	}
};

/**
 * Load stored behaviours from server
 */
Yatay.Common.loadBxs = function() {
	$('#remote_proj').html('');
	$('#btn_remote_loader').attr('disabled', 'disabled').html(Yatay.Msg.DIALOG_LOADING);

	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'loadBxs' },
		success: function(content) {
			$('#btn_remote_loader').removeAttr('disabled').html(Yatay.Msg.DIALOG_REMOTE_LOADER);
			var data = JSON.parse(content);
			if (data.length > 0) {
				$("#loadMainWindow").hide();
				var multiselector = '<tr>' + '<th>' + Yatay.Msg.DIALOG_PROJECT + '</th>' +
									'<th>' + Yatay.Msg.DIALOG_BEHAVIOURS + '</th>' + '</tr>';
				for (var i=0; i<data.length; i++) {
					var elem = data[i];
					if (elem.project != '') {
						multiselector += '<tr><td>' + elem.project + '</td><td>'
						multiselector += '<select id=\'' + elem.project + '\' multiple=\'multiple\'>';                                
						for (var j=0; j<elem.behaviours.length; j++) {
							var bx = elem.behaviours[j];
							if (Yatay.Common.bxsCode[elem.project] == undefined) {
								Yatay.Common.bxsCode[elem.project] = [];
							}
							Yatay.Common.bxsCode[elem.project][bx.block] = bx.code;
							multiselector += '<option value=\'' + bx.block + '\'>' + bx.block + '</option>';
						}
						multiselector += '</select></td></tr>';  
					}                              
				}
				$(multiselector).appendTo($('#remote_proj'));    
				
				for (var i=0; i<data.length; i++) {
					if (data[i].project != '') {
						Yatay.Common.buildMultiSelector($('#' + data[i].project));        
					}
				}
			} else {
				$('#projects').remove();
				var multiselector = '<p id=\'projects\' style=\'display:inline\'>' + Yatay.Msg.DIALOG_NO_BEHAVIOURS + '</p>';
				$(multiselector).insertBefore($('#btn_remote_loader'));
			}
			$('#btn_remote_loader').hide();
		},
		error:function() {}
	});
};

/**
 * Load code from xml
 */
Yatay.Common.fromXml = function() {
	if (Yatay.Common.fileCode != '') {
		var xmlEndTag = '</xml>';
		if (Blockly.mainWorkspace.getAllBlocks().length > 0) {
				Yatay.Common.bxReady();
		}
		var splittedBlocks = Yatay.Common.fileCode.split(xmlEndTag);
		splittedBlocks.pop();
		for (var j=0; j< splittedBlocks.length; j++)
		{
				Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, Blockly.Xml.textToDom(splittedBlocks[j] + xmlEndTag));
				Yatay.Common.bxReady();
		}

		Yatay.Common.fileCode = '';
		$('#loader_modal').modal('hide');        
	} else if (Yatay.Common.activesProj.length > 0) {
		for (var i=0; i<Yatay.Common.activesProj.length; i++) {
				var project = Yatay.Common.activesProj[i];
				for (var j=0; j<Yatay.Common.activesBxs[project].length; j++) {
						if (Blockly.mainWorkspace.getAllBlocks().length > 0) {
								Yatay.Common.bxReady();
						}        
						var code = Blockly.Xml.textToDom(Yatay.Common.bxsCode[project][Yatay.Common.activesBxs[project][j]]);
						Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, code);
				}
		}                
		Yatay.Common.bxsCode = [];
		Yatay.Common.activesBxs = [];        
		Yatay.Common.activesProj = [];
		$('#loader_modal').modal('hide');     
		Yatay.Common.bxReady();
	} else {
		$('#loader_modal').effect('shake');
	}
};

/**
 * Handle save click
 */
Yatay.Common.toXml = function() {
	if (Blockly.mainWorkspace.getAllBlocks().length > 0 || Yatay.Common.behaviours.length >0) {	
		var text = "";
		// Si hay bloques sin minimizar los marco listos
		if (Blockly.mainWorkspace.getAllBlocks().length >0) {
			Yatay.Common.bxReady()
		}
		for (var i = 0; i < Yatay.Common.behaviours.length; i++) {
			var codeXML = Yatay.Common.behaviours[i][1];	
			text += codeXML.toString();
		}		
	
		var nua = navigator.userAgent;
		var is_android_browser = ((nua.indexOf('Mozilla/5.0') > -1 && (nua.indexOf('Mobile') > -1 || nua.indexOf('Android') > -1) && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

		if (is_android_browser){
			Yatay.Common.saveTempLocal(escape(text).replace(/\./g, "%2E").replace(/\*/g,"%2A").replace(/\+/,"%2B"), false);
		} else {	
			var blob = new Blob([text], {type: "text/xml;charset=utf-8"});
			saveAs(blob, Yatay.Msg.FILE_BLOCKS + ".xml");
		}
	}
};

/**
 * Read local file
 */
Yatay.Common.readFile = function(evt) {
	var f = evt.target.files[0];
	if (f) {
		var r = new FileReader();
		r.onload = function(e) { 
			Yatay.Common.fileCode = e.target.result; 
		}
		r.readAsText(f);
	} else { 
		alert("Failed to load file");
	}
};

/**
 * Show file chooser modal
 */
Yatay.Common.openFileChooser = function(){
	$('#loader_modal').modal('show');
	$('#btn_remote_loader').show();
	$("#loadMainWindow").show();
	$('#remote_proj').html('');
	document.getElementById('file_input').addEventListener('change', Yatay.Common.readFile, false);
};

/**
 * Long Poll for results
 */
function pollResults() {
	setTimeout(function() {
		var idUser = Yatay.Common.getCookie("idUser");
		if (idUser == null) {
			location.reload(); 
			return;
		}
		//If it's running (boton stop is showing) then poll
		if ($('#btn_stop').css("display") != "none")	{
			$.ajax({
				url: "/index.html",
				type: "POST",
				data: {id:'poll', name:'', code:'', userId: idUser},
				success: function(html) {
					if (html.length > 0) {
						var sensorHtml = html.split('#;#')[0];
						var console = html.split('#;#')[1];
						if (!Yatay.Common.testMode) {
							var msg_console = Yatay.Msg.POPUP_RESULTS_CONSOLE;
							if (Yatay.Tablet != undefined) { 
								msg_console = ' - ' + msg_console;
							}
							$("#result_console").html('<strong>' + msg_console + '</strong>' + console);
						}
						var sensor = sensorHtml.split(' ')[0];
						var value = sensorHtml.replace(sensor,'');
						$("#result_sensor").html('<strong>' + Yatay.Msg.POPUP_RESULTS_ROBOTINFO + '</strong>' + sensor + value);
					} else {
						$("#result_sensor").html('');
						$("#result_console").html('');
					}
				},
				error:function() {},
				complete: pollResults
			});
		} else {
				$("#result_sensor").html('');
				$("#result_console").html('');
		}
	}, 100);
};

/**
 * Long Poll for debug
 */
function debugPoll() {
	setTimeout(function(){
		var idUser = Yatay.Common.getCookie("idUser");
		if (idUser == null) {
			location.reload(); 
			return;
		} 
		//If it's running (boton stop is showing) then poll
		if ($('#btn_stop').css("display") != "none")	{
			$.ajax({
				url: "/index.html",
				type: "POST",
				data: {id:'pollDebug', name:'', code:'', userId: idUser},
				success: function(html) {
					if (html.length > 0) {
						var behaviourName = html.split(':')[0];
						var behavioursAfterThisOne = false;
						var offset = 0;
						for (var i = 0; i < Yatay.Common.behaviours.length; i++) {
							if (Yatay.Common.behaviours[i][2] == behaviourName) {
								$('#'+Yatay.Common.behaviours[i][0]).click();
								//parseInt(html.split(':')[2]) es el id original del bloque de comportamiento
								
								break;
							}	
						}
						offset = Blockly.mainWorkspace.getTopBlocks()[0].id - parseInt(html.split(':')[1]);
						var blockId = parseInt(html.split(':')[2]) + offset;
						Yatay.DebugLastBlock = blockId;
						Blockly.mainWorkspace.getBlockById(blockId).select()
					}
				},
				error:function() {
				},
				complete: debugPoll
			});
		} else {
			if (Blockly.mainWorkspace.getBlockById(Yatay.DebugLastBlock) != null)	{
				Blockly.mainWorkspace.getBlockById(Yatay.DebugLastBlock).unselect()
			}
		}	
	}, 500);
};

/**
 * Refresh Butiá blocks
 */
Yatay.Common.refreshBlocksPoll = function() {
	setTimeout(function(){
		$.ajax({
			url: "/index.html",
			type: "POST",
			data: { id:'refreshBlocks' },
			success: function(content) {
				Yatay.Common.refresh = Yatay.Common.refresh || (content == 'yes');
				//If isn't to be run, then refresh!
				if (Yatay.Common.refresh && $('#btn_stop').css('display') == 'none'){
					Yatay.Common.refresh = false;
					location.reload(true);					
				}
			},
			error:function() {}, 
			complete: Yatay.Common.refreshBlocksPoll
		});
	}, 5000);
};

/**
 * Save in browser's localStorage
 */
Yatay.Common.saveInBrowser = function(name, code) {
	var localStgeBxs = [];
	if (localStorage.yatay_bxs != null && localStorage.yatay_bxs != "")
		localStgeBxs = JSON.parse(localStorage.yatay_bxs);
	for (var j=0; j< localStgeBxs.length; j++) {
		if (localStgeBxs[j][0] == name) {
			localStgeBxs[j][1] = code;
			localStorage.yatay_bxs = JSON.stringify(localStgeBxs);
			return;					
		} else {
			var found = false;
			//Checking if this behaviour in the local storage is actually being used now, if not is obsolete data and is deleted
			for (var i=0; i< Yatay.Common.behaviours.length; i++) {
				if (Yatay.Common.behaviours[i][2] == localStgeBxs[j][0]) {
					found = true;
					break;
				}
			}
			if (!found)
				localStgeBxs.splice(j,1);
		}
	}
	localStgeBxs[localStgeBxs.length] = [name, code];
	localStorage.yatay_bxs = JSON.stringify(localStgeBxs);
};

/**
 * Set Cookie
 */
Yatay.Common.setCookie = function(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	var expires = 'expires='+d.toGMTString();
	document.cookie = cname + '=' + cvalue + '; ' + expires;
};

/**
 * Get Cookie
 */
Yatay.Common.getCookie = function(cname) {
	var name = cname + '=';
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) return c.substring(name.length,c.length);
	}
	return '';
};

/**
* Projects cookie save
*/ 
Yatay.Common.projectSaver = function() {
	var proj_name = '';
	if (Yatay.Common.joinProj == '') {
		proj_name = $('#proj_input').val();        
	} else {
		proj_name = Yatay.Common.joinProj;        
	}

	if (proj_name != '' && proj_name != null) {
		Yatay.Common.setCookie('project_name', proj_name, 1); 
		$('#projmaneger_modal').modal('hide');
		if (Yatay.Tablet != undefined) {
			Yatay.Tablet.takeTour();
		}
	} else {
		$('#projmaneger_modal').effect( "shake" );
	}
};

/**
 * Handle robotest click
 */
Yatay.Common.robotest = function() {	
	try {	
		Yatay.Common.bxReady();
	} catch(e) {}

	if (Yatay.Tablet != undefined) {
		$("#behaviours_popup").hide();
	}

	Yatay.enterTestMode();
	Yatay.Common.testMode = true;

	if (Yatay.Tablet != undefined) {
		$('#btn_robotest').toggle('slow');
		$('#btn_load').toggle('slow');
		$('#btn_save').toggle('slow');
		$('#btn_bx_ready').toggle('slow');		
		$('#btn_edit').toggle('slow');
		$('#btn_lang').toggle('slow');
	} else {
		$('#btn_more').toggle('slow');
		if($('#btn_bxs_ready').is(":visible")) {			
			$('#btn_bxs_ready').toggle('slow');
		}
		Yatay.Mobile.slideToolbox(false);
	}
	$('#btn_stop').toggle();
};

/**
 * Handle run click
 */
Yatay.Common.runTasks = function() {
	if ($('#btn_stop').css('display') == 'none') {
		if (Yatay.Common.editedBxs.active == -1) {
			$('#btn_debug').toggle('slow');	   
		}	
		$('#btn_stop').toggle('slow');
		
		if (Yatay.Tablet != undefined) {
			$('#btn_robotest').toggle('slow');	
			$('#btn_load').toggle('slow');
			$('#btn_save').toggle('slow');		
			$('#btn_trash').toggle('slow');		
			$('#btn_edit').toggle('slow');
			$('#btn_bx_ready').toggle('slow');
			$('#btn_lang').toggle('slow');
		} else {
			$('#btn_more').toggle('slow');
		}
	} else {
		if (Yatay.Common.testMode) {
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
				Yatay.Common.bxReady()
			}

			var codes = new Array();
			for (var i = 0; i < Yatay.Common.behaviours.length; i++) {
				var code = '';
				//Has behaviours code been edited?
				if (Yatay.Common.editedBxs.active != -1) {
					code = Yatay.Common.editedBxs[i];
				} else {
					Yatay.variables = new Array();
					var codeXML = Blockly.Xml.textToDom(Yatay.Common.behaviours[i][1]);        
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
 * Handle code edited tabs switch 
 */
Yatay.Common.switchTabs = function(selected) {	
	if (Yatay.Common.editedBxs.active != -1) {
		$('#tab' + Yatay.Common.editedBxs.active).removeClass('active');
		Yatay.Common.editedBxs[Yatay.Common.editedBxs.active] = Yatay.Common.editor.getValue();
	}

	Yatay.Common.editor.setValue(Yatay.Common.editedBxs[selected.id]);
	
	$('#tab' + selected.id).addClass('active');
	Yatay.Common.editedBxs.active = selected.id;

	$('#code_modal').on('shown.bs.modal', function() {
		Yatay.Common.editor.refresh();
	});
};

/**
 * Handle hide edition modal
 */
Yatay.Common.closeEditor = function() {
	Yatay.Common.editedBxs.active = -1;
};

/**
 * Handle edit code click
 */
Yatay.Common.edit = function() {
	Yatay.Common.editedBxs = [];
	Yatay.Common.editedBxs.active = -1;

	if (Blockly.mainWorkspace.getAllBlocks().length>0) {
		Yatay.Common.bxReady()
	}

	if (Yatay.Common.behaviours.length>0){
		var tabs = '';
		Yatay.variables = new Array();
		for (var i=0; i<Yatay.Common.behaviours.length; i++) {
			var codeXml = Blockly.Xml.textToDom(Yatay.Common.behaviours[i][1]);	
			Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, codeXml);
			Yatay.Common.editedBxs[i] = Blockly.Lua.workspaceToCode();
			Blockly.mainWorkspace.clear();
			tabs += '<li id="tab'+i+'"><a id="'+i+'" onClick="Yatay.Common.switchTabs(this)" href="#">'+Yatay.Common.behaviours[i][2]+'</a></li>'	
		}
		$('#modal_tabs').html(tabs);

		$('#tab0').addClass('active');
		Yatay.Common.editedBxs.active = 0;

		if (Yatay.Common.editor == undefined) {
			Yatay.Common.editor = CodeMirror.fromTextArea($('#code_editable')[0], { tabMode: "indent", matchBrackets: true, theme: "neat" });
		}	
		Yatay.Common.editor.setValue(Yatay.Common.editedBxs[0]);

		$('#code_modal').modal({backdrop:'static'});

		$('#code_modal').on('shown.bs.modal', function() {
			Yatay.Common.editor.refresh();
		});
	}
};

/**
 * Handle run edited code
 */
Yatay.Common.runEditedTasks = function() {
	var selected = [];
	selected.id = Yatay.Common.editedBxs.active;
	Yatay.Common.switchTabs(selected);

	//Has behaviours code been edited?
	if (Yatay.Common.editedBxs.active != -1) {
		$('#code_modal').modal('hide');
	}

	Yatay.Common.runTasks();
};	

/**
 * Handle save edited code
 */
Yatay.Common.saveEditedCode = function() {
	var text = '';
	for (var i=0; i<Yatay.Common.editedBxs.length; i++) {
		text += '-- Block: ' + Yatay.Common.behaviours[i][2] + '\n';
		text += Yatay.Common.editedBxs[i] + '\n';
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
 * Handle debug click
 */
Yatay.Common.debug = function() {		
	Yatay.DebugBlockIdOffset = 0;
	Yatay.DebugMode = true;   
	Blockly.mainWorkspace.maxBlocks = 0;
	if (Blockly.mainWorkspace.getAllBlocks().length > 0) {
		Yatay.Common.bxReady()
	}

	var codes = new Array();
	Yatay.variables = new Array();
	for (var i = 0; i < Yatay.Common.behaviours.length; i++) {	
		var codeXML = Blockly.Xml.textToDom(Yatay.Common.behaviours[i][1]);        
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
Yatay.Common.stop = function() {	
	Blockly.mainWorkspace.maxBlocks = 'Infinity';
	//Has behaviours code been edited?
	if (Yatay.Common.editedBxs.active != -1) {
		$('#code_modal').modal({ backdrop:'static' });
	}

	if (Yatay.Common.testMode) {
		if (Yatay.Common.behaviours.length > 0) {
			if (Yatay.Tablet != undefined) {
				$("#behaviours_popup").show();
			} else {
				$("#btn_bxs_ready").show();								
			}			
		}
		Yatay.Common.testMode = false;
		Yatay.Common.killTasks();
		try {
			Yatay.leaveTestMode();
		} catch(e) {}
		
		if (Yatay.Mobile != undefined) {
			$('#content_blocks').removeClass('content-test');
		}
	} else {
		Yatay.DebugBlockIdOffset = 0;
		Yatay.Common.killTasks();
		if (Yatay.Common.editedBxs.active == -1) {
			$('#btn_debug').toggle('slow');	   
		}	   
	}
	
	if (Yatay.Tablet != undefined) {
		$('#btn_robotest').toggle('slow');		
		$('#btn_edit').toggle('slow');
		$('#btn_load').toggle('slow');
		$('#btn_save').toggle('slow');
		$('#btn_bx_ready').toggle('slow');
		$('#btn_lang').toggle('slow');
	} else {
		$('#btn_more').toggle('slow');
	}
	
	if(!$('#btn_trash').is(":visible")) {			
		$('#btn_trash').toggle('slow');
	}
	$('#btn_stop').toggle('slow');
	
	Yatay.DebugMode = false;
	for (var j=0; j < Blockly.mainWorkspace.getAllBlocks().length; j++) {
		Blockly.mainWorkspace.getAllBlocks()[j].setEditable(true);
		var blockType = Blockly.mainWorkspace.getAllBlocks()[j].type;
		if (blockType != "controls_behaviourTrigger") {//&& blockType != "controls_behaviour" && blockType != "controls_conditionalBehaviour")
			Blockly.mainWorkspace.getAllBlocks()[j].setMovable(true);
		}
	}
};

/**
* Projects cookie check
*/
Yatay.Common.projectChecker = function() {
	//Yatay.Common.setCookie('project_name', '', 1);   
	var proj_name = Yatay.Common.getCookie('project_name');  
	if (proj_name == '') {        
		$('#projmaneger_modal').modal({ backdrop:'static', keyboard:false });
	}
};

/**
* Load stored projects from server
*/
Yatay.Common.loadProj = function() {
        $('#btn_remote_proj').attr('disabled', 'disabled').html(Yatay.Msg.DIALOG_LOADING);
        $('#projects').multiselect('destroy');
        $('#projects').remove();

        $.ajax({
                url: "/index.html",
                type: "POST",
                data: { id:'loadProjs' },
                success: function(content) {
                        $('#btn_remote_proj').removeAttr('disabled').html(Yatay.Msg.DIALOG_REMOTE_LOADER);
                        var projs = JSON.parse(content);
                        if (projs.length > 0) {
                                Yatay.Common.joinProj = projs[0];
                        var multiselector = '<select id=\'projects\'>';
                                for (var i=0; i<projs.length; i++) {
                                        multiselector += '<option value=\'' + projs[i] + '\'>' + projs[i] + '</option>';
                                }
                                multiselector += '</select>';
                                $(multiselector).insertBefore($('#btn_remote_proj'));
                                Yatay.Common.buildMultiSelector($('#projects'), false);
                                $('.btn-group').addClass('dropup');
                        } else {
                                var multiselector = '<p id=\'projects\' style=\'display:inline\'>' + Yatay.Msg.DIALOG_NO_PROJS + '</p>';
                                $(multiselector).insertBefore($('#btn_remote_proj'));
                        }
						$('#btn_remote_proj').hide();
                },
                error:function(){}
        });
};

/**
 * saveTempLocal
 */
Yatay.Common.saveTempLocal = function(xml, edited) {
	//Warning the user
	alert("Tu navegador Android solo permite descargar extensiones conocidas. Se descargará el archivo como .apk, puedes cambiarle la extension luego :)");
	var project = Yatay.Common.getCookie('project_name');
	var userId = Yatay.Common.getCookie('idUser');
	var fileName = project+"_"+userId;
	if (edited)
		fileName += "_edited";
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'saveTempLocal', code:xml, project:fileName},
		success: function(content){
				var url = window.location.href.split("/yatay/")[0] + "/yatay/_downloads/" + fileName + ".apk";
				SaveToDisk(url);
		},
		error:function(){}
	});
};

/**
 * Adding style to toolbox
 */
Yatay.Common.addStyleToBlocklyToolbox = function() {
	$(".blocklyTreeRow").css('border-bottom-right-radius', '15px');	
	$(".blocklyTreeRow").css('border-bottom', '1px solid white');	
	$(".blocklyTreeRow").css('height', '35px');	
	$(".blocklyToolboxDiv div[role='treeitem']")[5].style.color = "#CF3F6F";
	$(".blocklyToolboxDiv div[role='treeitem']")[4].style.color = "darkviolet";		
	$(".blocklyToolboxDiv div[role='treeitem']")[3].style.color = "tomato";	
	$(".blocklyToolboxDiv div[role='treeitem']")[2].style.color = "green";	
	$(".blocklyToolboxDiv div[role='treeitem']")[1].style.color = "darkred";	
	$(".blocklyToolboxDiv div[role='treeitem']")[0].style.color = 'royalblue';
};

/**
 * Request a userId
 */
Yatay.Common.requestUserId = function() {
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'getUserId'},
		success: function(html){
			Yatay.Common.setCookie("idUser", html, 1);
		},
		error:function(err){
			alert(err);
		}
	});
};

/**
 * Set behaviour as ready
 */
Yatay.Common.bxReady = function() {
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
			Yatay.Common.behaviours.push([id, text, name, size]);

			var list = $('<li style="display:none;">' +
						'<div id="' + id + '" class="image-container">' +
							'<div class="image-inner-container">' +
								'<p class="overlay">' + name + '</p>' + Yatay.Msg.SVG_BEHAVIOURS +
							'</div>' +
						'</div>' +
					'</li>');
			
			if (Yatay.Tablet != undefined) {
				$('#behaviours_popup').show();
			} else {
				$('#btn_bxs_ready').show();								
			}
			
			list.appendTo($('#bx_list')).slideDown('slow');
			document.getElementById(id).onclick = Yatay.Common.bxToWorkspace;
			Blockly.mainWorkspace.clear();
		}
	}
};

/**
 * Draw selected behaviour to workspace
 */
Yatay.Common.bxToWorkspace = function() {
	for (i = 0; i < Yatay.Common.behaviours.length; ++i) {
		if (Yatay.Common.behaviours[i][0] == this.id) {
			code = Blockly.Xml.textToDom(Yatay.Common.behaviours[i][1]);
			var item = "#" + this.id;
			$(item).animate({height:'toggle'}, 'slow', function () {$(item).remove()});
			Yatay.Common.behaviours.splice(i, 1);
			if (Blockly.mainWorkspace.getAllBlocks().length > 0) {
				Yatay.Common.bxReady();
			}
			Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, code);
			//Disabling missing sensors
			for (var j=0; j < Blockly.mainWorkspace.getAllBlocks().length; j++) {
				if (Yatay.DebugMode) {
					Blockly.mainWorkspace.getAllBlocks()[j].setEditable(false);
					Blockly.mainWorkspace.getAllBlocks()[j].setMovable(false);
				} else {
					Blockly.mainWorkspace.getAllBlocks()[j].setEditable(true);
					var blockType = Blockly.mainWorkspace.getAllBlocks()[j].type;
					if (blockType != "controls_behaviourTrigger") { //&& blockType != "controls_behaviour" && blockType != "controls_conditionalBehaviour")
						Blockly.mainWorkspace.getAllBlocks()[j].setMovable(true);
					}
				}
				if (Yatay.missing_sensors.indexOf(Blockly.mainWorkspace.getAllBlocks()[j].type) != -1)
					Blockly.mainWorkspace.getAllBlocks()[j].setDisabled(true);
				else if (Blockly.mainWorkspace.getAllBlocks()[j].disabled)
					Blockly.mainWorkspace.getAllBlocks()[j].setDisabled(false);		
			}
		}
	}
	if (Yatay.Common.behaviours.length == 0) {
		if (Yatay.Tablet != undefined) {
			$("#behaviours_popup").hide();
		} else {
			$("#btn_bxs_ready").hide();								
		}
	}
	setTimeout(function() {
		var topM = Math.round(Blockly.mainWorkspace.getMetrics().viewTop);
		var leftM = Math.round(Blockly.mainWorkspace.getMetrics().viewLeft);
		Blockly.mainWorkspace.getTopBlocks()[0].setDragging_(true);
		var blockPos = Blockly.mainWorkspace.getTopBlocks()[0].getRelativeToSurfaceXY();
		Blockly.mainWorkspace.getTopBlocks()[0].moveBy(leftM - blockPos.x +15, topM - blockPos.y +15);
		Blockly.mainWorkspace.getTopBlocks()[0].setDragging_(false);
		Blockly.mainWorkspace.getTopBlocks()[0].select();
	}, 100);
};

/**
 * Change app language.
 */
Yatay.Common.changeLanguage = function() {
	if (BlocklyApps.LANG == 'es') {
		BlocklyApps.LANG = 'en';	
	} else {
		BlocklyApps.LANG = 'es';
	}
	
	var search = window.location.search;
	if (search.length <= 1) {
		search = '?lang=' + BlocklyApps.LANG;
	} else if (search.match(/[?&]lang=[^&]*/)) {
		search = search.replace(/([?&]lang=)[^&]*/, '$1' + BlocklyApps.LANG);
	} else {
		search = search.replace(/\?/, '?lang=' + BlocklyApps.LANG + '&');
	}
	window.location = window.location.protocol + '//' + window.location.host + window.location.pathname + search;
};
