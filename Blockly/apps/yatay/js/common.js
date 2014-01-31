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
Yatay.Common.openDeleteModal = function(){
	$("#delete_modal").modal('show');
};


/**
 * Send task to server
 */
Yatay.Common.sendTasks = function(code) {
	var values = escape(code).replace(/\./g, "%2E").replace(/\*/g,"%2A");
	var idUser = getCookie("idUser");
	if (idUser == null)
	{
		location.reload(); 
		return;
	}
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'init', code:values, userId: idUser},
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
	var idUser = getCookie("idUser");
	if (idUser == null)
	{
		location.reload(); 
		return;
	}
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'test', code:values, userId: idUser},
		success: function() {
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
	var idUser = getCookie("idUser");
	if (idUser == null)
	{
		location.reload(); 
		return;
	}
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'kill', code:'', userId: idUser},
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
                    var multiselector = '<tr>' +
                                                            '<th>' + Yatay.Msg.DIALOG_PROJECT + '</th>' +
                                                                        '<th>' + Yatay.Msg.DIALOG_BEHAVIOURS + '</th>' +
                                                    '</tr>';
                                for (var i=0; i<data.length; i++) {
                                        var elem = data[i];
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
                                $(multiselector).appendTo($('#remote_proj'));                                
                                for (var i=0; i<data.length; i++) {
                                        Yatay.Common.buildMultiSelector($('#' + data[i].project));        
                                }
                        } else {
                                $('#projects').remove();
                                var multiselector = '<p id=\'projects\' style=\'display:inline\'>' + Yatay.Msg.DIALOG_NO_BEHAVIOURS + '</p>';
                                $(multiselector).insertBefore($('#btn_remote_loader'));
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
			$('#loader_modal').modal('hide');        
	} else if (Yatay.Common.activesProj.length > 0) {
			for (var i=0; i<Yatay.Common.activesProj.length; i++) {
					var project = Yatay.Common.activesProj[i];
					for (var j=0; j<Yatay.Common.activesBxs[project].length; j++) {
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
			$('#loader_modal').modal('hide');                        
	} else {
			$('#loader_modal').effect('shake');
	}
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
	$("#loadMainWindow").show();
	$('#remote_proj').html('');
	document.getElementById('file_input').addEventListener('change', Yatay.Common.readFile, false);
};

/**
 * Long Poll for results
 */
function pollResults() {
	setTimeout(function() {
		var idUser = getCookie("idUser");
		if (idUser == null)
		{
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
						$("#spnConsole").text(console);
						var sensor = sensorHtml.split(' ')[0];
						var value = sensorHtml.replace(sensor,'');
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
				$("#spnConsole").text('');
		}
	}, 100);
};

/**
 * Long Poll for debug
 */
function debugPoll() {
	setTimeout(function(){
		var idUser = getCookie("idUser");
		if (idUser == null)
		{
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
        } else {
                $('#projmaneger_modal').effect( "shake" );
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
//        document.cookie = 'project_name' + '=' + '';        
        var proj_name = Yatay.Common.getProject();        
        if (proj_name == '') {        
                $('#projmaneger_modal').modal({ backdrop: 'static', keyboard: false });
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

/**
 * Request a userId
 */
function requestUserId() {
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'getUserId'},
		success: function(html){
			setCookie("idUser", html);
		},
		error:function(err){
			alert(err);
		}
	});
};

function getCookie(name) {   
	var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");   
	if (parts.length == 2) return parts.pop().split(";").shift(); 
}

function setCookie(name, value)
{
    var d = new Date();
    d.setTime(d.getTime()+(1*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = name + '=' + value + '; ' + expires;    
}
