/**
 * Visual Blocks Editor
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
 * @fileoverview Logic blocks for Blockly.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Blocks.butia');

goog.require('Blockly.Blocks');


Blockly.Blocks['butia_move'] = {
  
  init: function() {
    this.setColour(110);
	this.appendTitle(Blockly.Msg.BUTIA_MOVE);
	var dropdown = new Blockly.FieldDropdown([[Blockly.Msg.BUTIA_MOVE_FORWARD, 'moveForward', 
	[Blockly.Msg.BUTIA_MOVE_BACKWARD, 'moveBackward']]);
	this.appendTitle(dropdown, 'DIR');
	this.setPreviousStatement(true);
	this.setNextStatement(true);
	this.setTooltip(Blockly.Msg.BUTIA_MOVE_TOOLTIP);
  }
};
Blockly.Blocks['butia_turnLeftRight'] = {
	// Block for turning robot butiá left or right.
	init: function() {
		this.setColour(110);
		this.appendTitle('girar');
		var dropdown = new Blockly.FieldDropdown([[Blockly.Msg.BUTIA_TURNLEFTRIGHT_LEFT, 'turnLeft'], 
	[Blockly.Msg.BUTIA_TURNLEFTRIGHT_RIGHT, 'turnRight']]);
		this.appendTitle(dropdown, 'DIR');
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setTooltip(Blockly.Msg.BUTIA_TURNLEFTRIGHT_TOOLTIP);
	}
};

Blockly.Blocks['butia_stop'] = {
  init: function() {
    this.setColour(0);
	this.appendTitle(Blockly.Msg.BUTIA_STOP)
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {   
      return Blockly.Msg.BUTIA_STOP_TOOLTIP;
    });
  }
};

Blockly..Blocks['butia_grey'] = {
  init: function() {
    this.setColour(217);
	this.appendTitle(Blockly.Msg.BUTIA_GREY)
    this.setOutput(true, Number);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {   
      return Blockly.Msg.BUTIA_GREY_TOOLTIP;
    });
  }
};
