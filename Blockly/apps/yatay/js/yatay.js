/**
 * @fileoverview JavaScript for Blockly's Yatay application.
 * @author Yatay Group
 */

// Supported languages.
BlocklyApps.LANGUAGES = ['es','en'];
BlocklyApps.LANG = BlocklyApps.getLang();

// Use 'es' as default inBlocklyApps.LANG  
document.write('<script type="text/javascript" src="generated/' + 'es' + '.js"></script>\n');

/**
 * Create a namespace for the application.
 */
var Yatay = {};
Yatay.variables = new Array();
Yatay.complex_sensors = new Array();
Yatay.currentWorkspaceXml = "";

/**
 * Initialize Blockly.  Called on page load.
 */
Yatay.init = function() {
  BlocklyApps.init();
  Yatay.DebugMode = false;
  Yatay.DebugBlockIdOffset = 0;
  var rtl = BlocklyApps.isRtl();
  var toolbox = document.getElementById('toolbox');
  Blockly.inject(document.getElementById('content_blocks'),
      {path: '../../',
       rtl: rtl,
       toolbox: toolbox});

  // Add to reserved word list: Local variables in execution evironment (runJS)
  // and the infinite loop detection function.
  Blockly.JavaScript.addReservedWords('code,timeouts,checkTimeout');

  var container = document.getElementById('content_area');
  var onresize = function(e) {
    var bBox = BlocklyApps.getBBox_(container);
	var el = document.getElementById('content_blocks' );
	el.style.top = bBox.y + 'px';
	el.style.left = bBox.x + 'px';
	// Height and width need to be set, read back, then set again to
	// compensate for scrollbars.
	el.style.height = bBox.height + 'px';
	el.style.height = (2 * bBox.height - el.offsetHeight) + 'px';
	el.style.width = bBox.width + 'px';
	el.style.width = (2 * bBox.width - el.offsetWidth) + 'px';
    
   
  };
  window.addEventListener('resize', onresize, false);

  BlocklyApps.loadBlocks('');

  if ('BlocklyStorage' in window) {
    // Hook a save function onto unload.
    BlocklyStorage.backupOnUnload();
  }

  document.getElementById('content_blocks').style.visibility =
      'visible';
  Blockly.fireUiEvent(window, 'resize');
  Blockly.fireUiEvent(window, 'resize');


	//Override the toolbox disable filter to hide the blocks i want
	Blockly.Flyout.prototype.filterForCapacity_ = function() {
	  var remainingCapacity = this.targetWorkspace_.remainingCapacity();
	  var blocks = this.workspace_.getTopBlocks(false);
	  for (var i = 0, block; block = blocks[i]; i++) {
		var allBlocks = block.getDescendants();
		var disabled = allBlocks.length > remainingCapacity;
		if (block.type == "controls_behaviour" || block.type == "controls_conditionalBehaviour")
		{
			disabled = Yatay.workspaceHasBehaviour();
		}
		block.setDisabled(disabled);
	  }
	};

	// Override Mouse-up handler including Autosave listener
	var startXmlDom = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
	Yatay.currentWorkspaceXml = Blockly.Xml.domToText(startXmlDom);
	function change() {
		var xmlDom = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
		var xmlText = Blockly.Xml.domToText(xmlDom);
		var justOneBehaviour = Blockly.mainWorkspace.getTopBlocks().length == 1
								&& (Blockly.mainWorkspace.getTopBlocks()[0].type == "controls_behaviour" ||
								Blockly.mainWorkspace.getTopBlocks()[0].type == "controls_conditionalBehaviour");

		if (Yatay.currentWorkspaceXml != xmlText && justOneBehaviour) {
		  Yatay.currentWorkspaceXml = xmlText;
		  Yatay.AutoSave();
		}
	}
	var bindData = Blockly.addChangeListener(change);

	// Lazy-load the syntax-highlighting.
	window.setTimeout(BlocklyApps.importPrettify, 1);

	BlocklyApps.bindClick('trashButton', function() {Yatay.discard();});  
	setTimeout(function(){Blockly.mainWorkspace.render()},400);  
};

if (window.location.pathname.match(/readonly.html$/)) {
  window.addEventListener('load', BlocklyApps.initReadonly);
} else {
  window.addEventListener('load', Yatay.init);
}

/**
 * Execute the user's Yatay.
 * Just a quick and dirty eval.  Catch infinite loops.
 */
Yatay.runJS = function() {
  Blockly.JavaScript.INFINITE_LOOP_TRAP = '  checkTimeout();\n';
  var timeouts = 0;
  var checkTimeout = function() {
    if (timeouts++ > 1000000) {
      throw BlocklyApps.getMsg('Yatay_timeout');
    }
  };
  var code = Blockly.JavaScript.workspaceToCode();
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  try {
    eval(code);
  } catch (e) {
    alert(BlocklyApps.getMsg('Yatay_badCode').replace('%1', e));
  }
};

/**
 * Discard all blocks from the workspace.
 */
Yatay.discard = function() {
	var count = Blockly.mainWorkspace.getAllBlocks().length;
	var justOneBehaviour = Blockly.mainWorkspace.getTopBlocks().length == 1
									&& (Blockly.mainWorkspace.getTopBlocks()[0].type == "controls_behaviour" ||
									Blockly.mainWorkspace.getTopBlocks()[0].type == "controls_conditionalBehaviour");
	if (justOneBehaviour)
	{
		var name = Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].text_;
		if (localStorage.yatay_bxs != null && localStorage.yatay_bxs != "")
			localStgeBxs = JSON.parse(localStorage.yatay_bxs);
		for (var j=0; j< localStgeBxs.length; j++)
		{
			if (localStgeBxs[j][0] == name)
			{
				localStgeBxs.splice(j,1);
				break;
			}
		}
		localStorage.yatay_bxs = JSON.stringify(localStgeBxs);
	}
	if (count < 2 || window.confirm(BlocklyApps.getMsg('Yatay_discard').replace('%1', count))) {
		Blockly.mainWorkspace.clear();
		window.location.hash = '';
	}
};


Yatay.workspaceHasBehaviour = function(){
	var allBlocks = Blockly.mainWorkspace.getAllBlocks();
	for (var i = 0; i < allBlocks.length; i++)
	{
		if (allBlocks[i].type == "controls_behaviour"  || allBlocks[i].type == "controls_conditionalBehaviour")
			return true;
	}
	return false;
}

Yatay.enterTestMode = function(){
	Blockly.mainWorkspace.clear();	
	//Remove all items from toolbox except "Butia"
	Blockly.Toolbox.tree_.children_[0].dispose();
	Blockly.Toolbox.tree_.children_[1].dispose();
	Blockly.Toolbox.tree_.children_[3].dispose();
	Blockly.Toolbox.tree_.children_[4].dispose();
	Blockly.Toolbox.tree_.children_[5].dispose();
	//Only one block allowed
	Blockly.mainWorkspace.maxBlocks = 1;
	
}

Yatay.leaveTestMode = function(){
	//Remove all items from toolbox (to avoid repeatance of items on init) and init toolbox again
	Blockly.Toolbox.tree_.children_[2].dispose();
	Blockly.Toolbox.init();
	Blockly.mainWorkspace.maxBlocks = "Infinite";
}


Yatay.ExistVariable = function(variable){
	var name = Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].text_;
	if (Yatay.variables[name] == null)	
	{
		Yatay.variables[name] = new Array();
		Yatay.variables[name][variable] = true;
		return false;
	}
	else if (Yatay.variables[name][variable] == null)
	{
		Yatay.variables[name][variable] = true;
		return false;
	}
	else
		return true;
}

Yatay.ReturnCustomSensor = function(sensor) {
	var name = Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].text_;
	if (Yatay.complex_sensors[name] == null) {
		Yatay.complex_sensors[name] = new Array();
		return "";
	} else if (Yatay.complex_sensors[name][sensor] != null) {
		return Yatay.complex_sensors[name][sensor];
	}else
		return "";
}

Yatay.CreateCustomSensor = function(sensor, code) {
	var name = Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].text_;
	if (Yatay.complex_sensors[name] == null) {
		Yatay.complex_sensors[name] = new Array();		
	}
	Yatay.complex_sensors[name][sensor] = code;
	return;
}

Yatay.AutoSave = function()
{
	// Autosave listener
	if (Blockly.mainWorkspace != null && Blockly.mainWorkspace.getAllBlocks().length >1) {

		var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
		var code = Blockly.Xml.domToText(xml);
		var name = Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].text_;
		//if (name != Yatay.Msg.CONTROL_BEHAVIOUR) {
		if (Yatay.countBlocks != Blockly.mainWorkspace.getAllBlocks().length) {
			Yatay.countBlocks = Blockly.mainWorkspace.getAllBlocks().length;
			Yatay.Common.saveTask(name, code);
		}
		//Saving in browser localstorage to avoid losing behaviours and blocks on reload 
		Yatay.Common.saveInBrowser(name, code);
	//	}
	}
}
