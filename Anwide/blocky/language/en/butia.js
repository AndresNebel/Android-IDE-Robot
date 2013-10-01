/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://code.google.com/p/blockly/
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
 * @fileoverview Logic blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 * Due to the frequency of long strings, the 80-column wrap rule need not apply
 * to language files.
 */

if (!Blockly.Language){ 
	Blockly.Language = {};
}

Blockly.Language.butia_move = {
	// Block for moving robot butiá forward or backwards.
	category: Blockly.LANG_CATEGORY_BUTIA,
	helpUrl: Blockly.LANG_BUTIA_COMPARE_HELPURL,
	init: function() {
		this.setColour(290);
		this.appendTitle('move');
		var dropdown = new Blockly.FieldDropdown(this.DIRECTIONS);
		this.appendTitle(dropdown, 'DIR');
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setTooltip('Moves Butiá forward or backward.');
	}
};

Blockly.Language.butia_move.DIRECTIONS =
    [['forward', 'moveForward'], ['backward', 'moveBackward']];

Blockly.Language.butia_turnLeftRight = {
	// Block for turning robot butiá left or right.
	category: Blockly.LANG_CATEGORY_BUTIA,
	helpUrl: Blockly.LANG_BUTIA_COMPARE_HELPURL,
	init: function() {
		this.setColour(110);
		this.appendTitle('turn');
		var dropdown = new Blockly.FieldDropdown(this.DIRECTIONS);
		this.appendTitle(dropdown, 'DIR');
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setTooltip('Turns Butiá left ir right.');
	}
};

Blockly.Language.butia_turnLeftRight.DIRECTIONS =
    [['left', 'turnLeft'], ['right', 'turnRight']];

	
	
Blockly.Language.butia_stop = {
  category: Blockly.LANG_CATEGORY_BUTIA,
  init: function() {
    this.setColour(0);
	this.appendTitle('stop ')
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {   
      return "Stop Butiá";
    });
  }
};

Blockly.Language.butia_grey = {
  category: Blockly.LANG_CATEGORY_BUTIA,
  init: function() {
    this.setColour(217);
	this.appendTitle('gray sensor')
    this.setOutput(true, Number);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {   
      return "Gives the gray sensor value";
    });
  }
};
