/**
 * @fileoverview 
 * @author Yatay Project
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
 * Initialize (start refresh blocks poll)
 */
$(document).ready(function(){	   
	Yatay.Common.refreshBlocksPoll();
});

/**
 * Show Project Manager Modal (when the page is loaded)
 */
$(window).load(function(){
	Yatay.Common.projectChecker();
});

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
	
	var selected = element['context']['value'];		
	var project = element['context']['id'];
	var blocks = element['context']['children'];
	
	if (selected == '') {
		Yatay.Common.activesProj.pop(project)
		Yatay.Common.activesBxs[project] = [];
	} else if (selected == 'multiselect-select-all') {
		for (var i = 1; i < blocks.length; i++) {			
			var block = element['context']['children'][i]['label'];
			if (Yatay.Common.activesBxs[project] == undefined) {
				Yatay.Common.activesBxs[project] = []
			}
			if (Yatay.Common.activesProj.indexOf(project) == -1) {
				Yatay.Common.activesProj.push(project);
			}
			if (Yatay.Common.activesBxs[project].indexOf(block) == -1) {
				Yatay.Common.activesBxs[project].push(block);				
			}
		}
	} else {
		if (Yatay.Common.activesBxs[project] == undefined) {
			Yatay.Common.activesBxs[project] = []
		}
		if (Yatay.Common.activesProj.indexOf(project) == -1) {
			Yatay.Common.activesProj.push(project);
		}
		Yatay.Common.activesBxs[project].push(selected);
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
 * Send task to server
 */
Yatay.Common.sendTasks = function(code) {
	var values = escape(code).replace(/\./g, "%2E").replace(/\*/g,"%2A");
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'init', code:values},
		success: function() {},
		error:function() {
			$("#spnResSensor").text('Intenta ejecutar otra vez.');
			$('#divResults').show();
		}
	});
};

/**
 * Send Robot Test block to server
 */
Yatay.Common.testRobot = function(code) {
	var values = escape(code).replace(/\./g, "%2E").replace(/\*/g,"%2A");
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'test', code:values},
		success: function() {},
		error:function() {
			$("#spnResSensor").text('Intenta ejecutar otra vez.');
			$('#divResults').show();
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
		success: function(content){},
		error:function(){}
	});
};

/**
 * Save current task
 */
Yatay.Common.saveTask = function(block, code) {
	var values = escape(code).replace(/\./g, "%2E").replace(/\*/g,"%2A");
	var project = Yatay.Common.getProject();
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'save', project:project, block:block, code:values }, 
		success: function(){},
		error:function(){}
	});
};

/**
 * Load stored behaviours from server
 */
Yatay.Common.loadBxs = function() {
	$('#remote_proj').html('');
	$("#loadMainWindow").hide();
	$('#btn_remote_loader').attr('disabled', 'disabled').html(Yatay.Msg.DIALOG_LOADING);

	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'loadBxs' },
		success: function(content) {
			$('#btn_remote_loader').removeAttr('disabled').html(Yatay.Msg.DIALOG_REMOTE_LOADER);
			if (content.length > 0) {
				// TODO: Use JSON parser
				// Create multiselector table
                    var multiselector = '<tr>' + 
                    					'<th>' + Yatay.Msg.DIALOG_PROJECT + '</th>' +
									'<th>' + Yatay.Msg.DIALOG_BEHAVIOURS + '</th>' +
                    				'</tr>';
				var projs = content.split('|');
				for (var i = 0; i < projs.length; i++) {
					var proj = projs[i].split('#');
					multiselector += '<tr><td>' + proj[0] + '</td><td>'
					multiselector += '<select id=\'' + proj[0] + '\' multiple=\'multiple\'>';	
					var bxs = proj[1].split(';');				
					for (var j = 0; j < bxs.length; j++) {
						var bx = bxs[j].split(',');
						if (Yatay.Common.bxsCode[proj[0]] == undefined) {
							Yatay.Common.bxsCode[proj[0]] = [];
						}
						Yatay.Common.bxsCode[proj[0]][bx[0]] = bx[1];
						multiselector += '<option value=\'' + bx[0] + '\'>' + bx[0] + '</option>';
					}
					multiselector += '</select></td></tr>';				
				}
				// Append multiselector table to dialog
				$(multiselector).appendTo($('#remote_proj'));
				// Build all multiselectors				
				for (var i = 0; i < projs.length; i++) {
					var proj = projs[i].split('#');
					Yatay.Common.buildMultiSelector($('#' + proj[0]));	
				}
			} else {
				var multiselector = '<p>' + Yatay.Msg.DIALOG_NO_BEHAVIOURS + '<p>';
				$(multiselector).appendTo($('#remote_proj'));
			}
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
			bxReady();
		}
		var splittedBlocks = Yatay.Common.fileCode.split(xmlEndTag);
		splittedBlocks.pop();
		for (var j=0; j< splittedBlocks.length; j++)
		{
			Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, Blockly.Xml.textToDom(splittedBlocks[j] + xmlEndTag));
			bxReady();
		}
	
		Yatay.Common.fileCode = '';
	} else if (Yatay.Common.activesProj.length > 0) {
		for (var i = 0; i < Yatay.Common.activesProj.length; i++) {
			var project = Yatay.Common.activesProj[i];
			for (var j = 0; j < Yatay.Common.activesBxs[project].length; j++) {
				if (Blockly.mainWorkspace.getAllBlocks().length > 0) {
					bxReady();
				}	
				var code = Blockly.Xml.textToDom(Yatay.Common.bxsCode[project][Yatay.Common.activesBxs[project][j]]);
				Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, code);
			}
		}		
		Yatay.Common.bxsCode = [];
		Yatay.Common.activesBxs = [];	
		Yatay.Common.activesProj = [];				
	}
	$('#remote_proj').html('');
	$('#loader_modal').modal('hide');
};

/**
 * Handle save click
 */
Yatay.Common.toXml = function(link) {
		if (Blockly.mainWorkspace.getAllBlocks().length > 0 || Yatay.Tablet.behaviours.length >0) {	
			var text = ""
			// Si hay bloques sin minimizar los marco listos
			if (Blockly.mainWorkspace.getAllBlocks().length >0) {
				bxReady()
			}
			for (var i = 0; i < Yatay.Tablet.behaviours.length; i++) {
				var codeXML = Yatay.Tablet.behaviours[i][1];	
				text += codeXML.toString();
			}		
		

			var nua = navigator.userAgent;
			var is_android_browser = ((nua.indexOf('Mozilla/5.0') > -1 && (nua.indexOf('Mobile') > -1 || nua.indexOf('Android') > -1) && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

			if (is_android_browser)
			{
				Yatay.Common.saveTempLocal(escape(text).replace(/\./g, "%2E").replace(/\*/g,"%2A"));
			}
			else
			{	
				link.href = 'data:text/xml; charset=UTF-8,' + text; 
				link.download = 'bloques.xml';
			}
		} else {
			link.href = 'javascript:void(0)'; 
			link.download = '';
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
			Yatay.Common.fileCode = e.target.result; //Blockly.Xml.textToDom(e.target.result);  
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
	$("#loadMainWindow").show();
	$('#remote_proj').html('');
	document.getElementById('file_input').addEventListener('change', Yatay.Common.readFile, false);
};

/**
 * Long Poll for results
 */
function pollResults() {
	setTimeout(function() {
		//If it's running (boton stop is showing) then poll
		if ($('#btn_stop').css("display") != "none")	{
			$.ajax({
				url: "/index.html",
				type: "POST",
				data: {id:'poll', name:'', code:''},
				success: function(html) {
					if (html.length > 0) {
						var sensor = html.split(' ')[0];
						var value = html.replace(sensor,'');
						if ($("#spnResSensor").text() != sensor || $("#spnResValue").text() != value)
							$('#divResults').show();
						$("#spnResSensor").text(sensor);
						$("#spnResValue").text(value);

					} else {
						$("#spnResSensor").text('');
						$("#spnResValue").text('');
					}
				},
				error:function() {},
				complete: pollResults
			});
		} else {
				$("#spnResSensor").text('');
				$("#spnResValue").text('');
		}
	}, 1000);
};

/**
 * Long Poll for debug
 */
function debugPoll() {
	setTimeout(function(){
		//If it's running (boton stop is showing) then poll
		if ($('#btn_stop').css("display") != "none")	{
			$.ajax({
				url: "/index.html",
				type: "POST",
				data: {id:'pollDebug', name:'', code:''},
				success: function(html) {
					if (html.length > 0) {
						var behaviourName = html.split(':')[0];
						var behavioursAfterThisOne = false;
						var offset = 0;
						for (var i = 0; i < Yatay.Tablet.behaviours.length; i++) {
							if (Yatay.Tablet.behaviours[i][2] == behaviourName) {
								$('#'+Yatay.Tablet.behaviours[i][0]).click();
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
 * createBlocksForSensors
 */
function createBlocksForSensors() {
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'getSensorsFunc', code:''},
		success: function(content){},
		error:function(){}
	});
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
			success: function(content){
				if (content == 'yes') {
					location.reload(true);
				}
			},
			error:function() {}, 
			complete: Yatay.Common.refreshBlocksPoll
		});
	}, 30000);
};

/**
 * Save in browser's localStorage
 */
Yatay.Common.saveInBrowser = function(name, code) {
	var localStgeBxs = [];
	if (localStorage.yatay_bxs != null && localStorage.yatay_bxs != "")
		localStgeBxs = JSON.parse(localStorage.yatay_bxs);
	for (var j=0; j< localStgeBxs.length; j++)
	{
		if (localStgeBxs[j][0] == name)
		{
			localStgeBxs[j][1] = code;
			localStorage.yatay_bxs = JSON.stringify(localStgeBxs);
			return;					
		}
		else 
		{
			var found = false;
			//Checking if this behaviour in the local storage is actually being used now, if not is obsolete data and is deleted
			for (var i=0; i< Yatay.Tablet.behaviours.length; i++)
			{
				if (Yatay.Tablet.behaviours[i][2] == localStgeBxs[j][0])
				{
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
		var d = new Date();
		d.setTime(d.getTime()+(1*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = 'project_name' + '=' + proj_name + '; ' + expires;
		$('#projmaneger_modal').modal('hide');
	}
};

/**
 * Get project from cookie
 */
Yatay.Common.getProject = function() {
	var proj_name = '';
	var name = 'project_name' + '=';
	var ca = document.cookie.split(';');
	for (var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) 
			proj_name = c.substring(name.length,c.length);
	}
	return proj_name;
};

/**
 * Projects cookie check
 */
Yatay.Common.projectChecker = function() {
	document.cookie = 'project_name' + '=' + '';	
	var proj_name = Yatay.Common.getProject();	
	if (proj_name == '') {	
		$('#projmaneger_modal').modal('show');
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
			if (content.length > 0) {
				var projs = content.split(';');
                    var multiselector = '<select id=\'projects\' multiple=\'multiple\'>';
				for (var i = 0; i < projs.length; i++) {
					multiselector += '<option value=\'' + projs[i] + '\'>' + projs[i] + '</option>';
				}
				multiselector += '</select>';
				$(multiselector).insertBefore($('#btn_remote_proj'));
				for (var i = 0; i < projs.length; i++) {
					Yatay.Common.buildMultiSelector($('#projects'), false);
				}
			} else {
				var multiselector = '<p>' + Yatay.Msg.DIALOG_NO_PROJS + '<p>';
				$(multiselector).append($('#btn_remote_proj'));
			}
		},
		error:function(){}
	});
};


Yatay.Common.saveTempLocal = function(xml) {
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'saveTempLocal', code:xml, name:'yatay'},
		success: function(content){
				SaveToDisk("http://192.168.1.44:8080/apps/yatay/_downloads/yatay.apk")
		},
		error:function(){
			alert("failure");
		}
	});
};
