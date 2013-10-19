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

document.write('<script type="text/javascript" src="generated/' + BlocklyApps.LANG + '.js"></script>\n');

/**
 * Create a namespace for the application.
 */
var Yatay = {};

/**
 * Initialize Blockly.  Called on page load.
 */
Yatay.init = function() {
  BlocklyApps.init();

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
  
  // Lazy-load the syntax-highlighting.
  window.setTimeout(BlocklyApps.importPrettify, 1);
  Blockly.mainWorkspace.clear();
  BlocklyApps.bindClick('trashButton',
      function() {Yatay.discard();});
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
