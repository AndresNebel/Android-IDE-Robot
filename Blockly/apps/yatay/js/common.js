/**
 * @fileoverview 
 * @author 
 */

if (!Yatay.Common){ 
	Yatay.Common = {};
} 

/**
 * Xml workspace code 
 * @type {string}
 */
Yatay.Common.domCode = null; 

/**
 * Count workspace blocks
 * @type {int}
 */
Yatay.Common.countBlocks = 0; 

/**
 * Attach autosave listener
 */
$(document).ready(function(){
	$("#content_blocks").click(Yatay.Common.autoSave);
});

/**
 * Autosave listener
 */
Yatay.Common.autoSave = function() {
	if (Blockly.mainWorkspace != null) {
		if (Yatay.Common.countBlocks != Blockly.mainWorkspace.getAllBlocks().length) {
			var name = Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].text_;
			if (name != "comportamiento") {
				Yatay.Common.countBlocks = Blockly.mainWorkspace.getAllBlocks().length;
				var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
				var code = Blockly.Xml.domToText(xml);
				Yatay.Common.saveTask(name, code);
			}
		}
	}
};

/**
 * Handle edit code click
 */
Yatay.Common.edit = function() {	
	$('#code_editable').html(Blockly.Lua.workspaceToCode());
	$('#code_modal').modal('show');
};

/**
 * Show file chooser modal
 */
Yatay.Common.openFileChooser = function(){
	$('#fchooser_modal').modal('show');
	document.getElementById('file_input').addEventListener('change', Yatay.Common.readFile, false);
};

/**
 * Read file, and load domCode
 */
Yatay.Common.readFile = function(evt) {
	var f = evt.target.files[0];
	if (f) {
		var r = new FileReader();
		r.onload = function(e) { 
			Yatay.Common.domCode = Blockly.Xml.textToDom(e.target.result);  
		}
		r.readAsText(f);
	} else { 
		alert("Failed to load file");
	}
};

/**
 * Load code from xml
 */
Yatay.Common.fromXml = function() {
	Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, Yatay.Common.domCode);
	$('#fchooser_modal').modal('hide');
};

/**
 * Handle save click
 */
Yatay.Common.toXml = function() {
	var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
	var text = Blockly.Xml.domToText(xml);
	var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
	var name = Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].text_;
	saveAs(blob, name + ".xml");
};

/**
 * Image click correction
 */
 Yatay.Common.imgClickCorrection = function() {
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
 * Send task to server
 */
Yatay.Common.sendTasks = function(code) {
	var values = escape(code).replace(/\./g, "%2E");
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'init', code:values},
		success: function() {
			//alert("success");
		},
		error:function() {
			//alert("failure");
		}
	});
};

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
	var values = escape(code);
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'save', name:name, code:values},
		success: function(content){
			//alert("success");
		},
		error:function(){
			//alert("failure");
		}
	});
};