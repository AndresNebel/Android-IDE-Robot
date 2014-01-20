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
 * Selected behaviours to be loaded 
 * @type {[string]}
 */
Yatay.Common.activesBxs = [];

/**
 * Initialize (start refresh blocks poll)
 */
$(document).ready(function(){	   
	refreshBlocksPoll();
});

/**
 * Bootstrap-multiselect list builder
 */ 
Yatay.Common.buildMultiSelector = function(select) {
	var value = 'multiselect-select-all';
	select.multiselect({
		includeSelectAllOption: true,
		onChange: Yatay.Common.BxsChangeSelection,
		selectAllValue: value
	});
	return false;
};

/**
 * Handle onChange of Bootstrap-multiselect list
 */
Yatay.Common.BxsChangeSelection = function(element, checked) {
	$(".modal-body").scrollTop($(".modal-body")[0].scrollHeight);
	if (element['context']['value'] == '') {
		Yatay.Common.activesBxs = [];
	} else if (element['context']['value'] == 'multiselect-select-all') {
		for (var i = 1; i < element['context']['children'].length; i++) {
			if ($.inArray(element['context']['children'][i]['label'], Yatay.Common.activesBxs) == -1) {
				Yatay.Common.activesBxs.push(element['context']['children'][i]['label']);
			}
		}
	} else {
		Yatay.Common.activesBxs.push(element['context']['value']);
	}
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
		success: function() {
			//alert("success");
		},
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
		success: function() {
			//alert("success");
		},
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
		success: function(content){
			//alert("success");
		},
		error:function(){
			//alert("failure");
		}
	});
};

/**
 * Save current task
 */
Yatay.Common.saveTask = function(name, code) {
	var values = escape(code).replace(/\./g, "%2E").replace(/\*/g,"%2A");
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'save', name:name, code:values },
		success: function(content){
			//alert("success");
		},
		error:function(){
			//alert("failure");
		}
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
		data: { id:'loadProjs' },
		success: function(content) {
			$('#btn_remote_loader').removeAttr('disabled').html(Yatay.Msg.DIALOG_REMOTE_LOADER);
			if (content.length > 0) {
				var bxs = content.split(';');
                    var multiselector = '<tr>' + 
                    					'<th>' + Yatay.Msg.DIALOG_PROJECT + '</th>' +
									'<th>' + Yatay.Msg.DIALOG_BEHAVIOURS + '</th>' +
                    				'</tr>';
				multiselector += '<tr><td>' + 'default ' + '</td><td>'
				multiselector += '<select id=\'project\' multiple=\'multiple\'>';
				for (var i = 0; i < bxs.length; i++) {
					var bx = bxs[i].split(',');
					Yatay.Common.bxsCode[bx[0]] = bx[1];
					multiselector += '<option value=\'' + bx[0] + '\'>' + bx[0] + '</option>';
				}
				multiselector += '</select></td></tr>';
				$(multiselector).appendTo($('#remote_proj'));
				Yatay.Common.buildMultiSelector($('#project'));	
			} else {
				var multiselector = '<p>' + Yatay.Msg.DIALOG_NO_BEHAVIOURS + '<p>';
				$(multiselector).appendTo($('#remote_proj'));
			}
		},
		error:function(){
			//alert("failure");
		}
	});
};

/**
 * Load code from xml
 */
Yatay.Common.fromXml = function() {
	if (Yatay.Common.fileCode != '') {
		if (Blockly.mainWorkspace.getAllBlocks().length > 0) {
			bxReady();
		}
		Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, Yatay.Common.fileCode);
		Yatay.Common.fileCode = '';
	} else if (0 < Yatay.Common.activesBxs.length) {
		for (var i = 0; i < Yatay.Common.activesBxs.length; i++) {
			if (Blockly.mainWorkspace.getAllBlocks().length > 0) {
				bxReady();
			}
			var code = Blockly.Xml.textToDom(Yatay.Common.bxsCode[Yatay.Common.activesBxs[i]]);
			Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, code);
		}		
		Yatay.Common.bxsCode = [];
		Yatay.Common.activesBxs = [];					
	}
	$('#remote_proj').html('');
	$('#loader_modal').modal('hide');
};

/**
 * Handle save click
 */
Yatay.Common.toXml = function(link) {
	if (Blockly.mainWorkspace.getAllBlocks().length > 0) {	
		var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
		var text = Blockly.Xml.domToText(xml);
		var name = Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].text_;
		link.href = 'data:text/xml;charset=UTF-8,' + text; 
		link.download = name + '.xml';
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
			Yatay.Common.fileCode = Blockly.Xml.textToDom(e.target.result);  
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
		success: function(content){
			//alert("success");
		},
		error:function(){
			//alert("failure");
		}
	});
};

/**
 * Refresh Butiá blocks
 */
function refreshBlocksPoll() {
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
			error:function(){
				//alert("failure");
			}, 
			complete: refreshBlocksPoll
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
}
