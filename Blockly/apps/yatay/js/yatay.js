/**
 * Blockly Apps: YataY
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview JavaScript for Blockly's YataY application.
 * @author YataY Group
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
	Blockly.Block.prototype.onMouseUp_ = function(e) {
		Blockly.terminateDrag_();
		if (Blockly.selected && Blockly.highlightedConnection_) {
			// Connect two blocks together.
			Blockly.localConnection_.connect(Blockly.highlightedConnection_);
			if (this.svg_) {
		 		// Trigger a connection animation.
		 		// Determine which connection is inferior (lower in the source stack).
		 		var inferiorConnection;
		 		if (Blockly.localConnection_.isSuperior()) {
		   			inferiorConnection = Blockly.highlightedConnection_;
				} else {
		   			inferiorConnection = Blockly.localConnection_;
		 		}
		 		inferiorConnection.sourceBlock_.svg_.connectionUiEffect();
			}

			if (this.workspace.trashcan && this.workspace.trashcan.isOpen) {
		 		// Don't throw an object in the trash can if it just got connected.
		 		this.workspace.trashcan.close();
			}
		} else if (this.workspace.trashcan && this.workspace.trashcan.isOpen) {
			var trashcan = this.workspace.trashcan;
			goog.Timer.callOnce(trashcan.close, 100, trashcan);
			Blockly.selected.dispose(false, true);
			// Dropping a block on the trash can will usually cause the workspace to
			// resize to contain the newly positioned block.  Force a second resize now
			// that the block has been deleted.
			Blockly.fireUiEvent(window, 'resize');
		}
		if (Blockly.highlightedConnection_) {
			Blockly.highlightedConnection_.unhighlight();
			Blockly.highlightedConnection_ = null;
		}

		// Autosave listener
		if (Blockly.mainWorkspace != null) {
			if (Yatay.countBlocks != Blockly.mainWorkspace.getAllBlocks().length) {
				Yatay.countBlocks = Blockly.mainWorkspace.getAllBlocks().length;
				var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
				var code = Blockly.Xml.domToText(xml);
				var name = Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].text_;
				if (name != Yatay.Msg.CONTROL_BEHAVIOUR) {
					Yatay.Common.saveTask(name, code);
				}
			}
		}
	};	
	
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
  if (count < 2 ||
      window.confirm(BlocklyApps.getMsg('Yatay_discard').replace('%1', count))) {
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
