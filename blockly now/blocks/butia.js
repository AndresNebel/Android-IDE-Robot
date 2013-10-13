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
  // If/elseif/else condition.
  init: function() {
    this.setHelpUrl(Blockly.LANG_BUTIA_COMPARE_HELPURL);
    this.setColour(110);
	this.appendTitle('mover');
	var dropdown = new Blockly.FieldDropdown([['adelante', 'moveForward', 
	['atrás', 'moveBackward']]);
	this.appendTitle(dropdown, 'DIR');
	this.setPreviousStatement(true);
	this.setNextStatement(true);
	this.setTooltip('Mueve el Butiá hacia adelante o atrás.');
  }
};
Blockly.Blocks['butia_turnLeftRight'] = {
	// Block for turning robot butiá left or right.
	category: Blockly.LANG_CATEGORY_BUTIA,
	helpUrl: Blockly.LANG_BUTIA_COMPARE_HELPURL,
	init: function() {
		this.setColour(110);
		this.appendTitle('girar');
		var dropdown = new Blockly.FieldDropdown([['izquierda', 'turnLeft'], 
	['derecha', 'turnRight']]);
		this.appendTitle(dropdown, 'DIR');
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setTooltip('Gira el Butiá hacia la derecha o izquierda.');
	}
};

Blockly.Blocks['butia_stop'] = {
  category: Blockly.LANG_CATEGORY_BUTIA,
  init: function() {
    this.setColour(0);
	this.appendTitle('detener ')
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {   
      return "Detener el Robot Butia";
    });
  }
};

Blockly.Language.butia_grey = {
  category: Blockly.LANG_CATEGORY_BUTIA,
  init: function() {
    this.setColour(217);
	this.appendTitle('sensor gris')
    this.setOutput(true, Number);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {   
      return "El valor del sensor de grises el Robot Butia";
    });
  }
};
