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
 * Power by: Yatay
 * Due to the frequency of long strings, the 80-column wrap rule need not apply
 * to language files.
 */

if (!Blockly.Language) Blockly.Language = {};

Blockly.Language.butia_move = {
	// Block for moving robot butiá forward or backwards.
	category: Blockly.LANG_CATEGORY_BUTIA,
	helpUrl: Blockly.LANG_BUTIA_COMPARE_HELPURL,
	init: function() {
		this.setColour(110);
		this.appendTitle('mover');
		var dropdown = new Blockly.FieldDropdown(this.DIRECTIONS);
		this.appendTitle(dropdown, 'DIR');
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setTooltip('Mueve el Butiá hacia adelante o atrás.');
	}
};

Blockly.Language.butia_move.DIRECTIONS =
	[['adelante', 'moveForward'], 
	['atrás', 'moveBackward']];

Blockly.Language.butia_turnLeftRight = {
	// Block for turning robot butiá left or right.
	category: Blockly.LANG_CATEGORY_BUTIA,
	helpUrl: Blockly.LANG_BUTIA_COMPARE_HELPURL,
	init: function() {
		this.setColour(110);
		this.appendTitle('girar');
		var dropdown = new Blockly.FieldDropdown(this.DIRECTIONS);
		this.appendTitle(dropdown, 'DIR');
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setTooltip('Gira el Butiá hacia la derecha o izquierda.');
	}
};

Blockly.Language.butia_turnLeftRight.DIRECTIONS =
	[['izquierda', 'turnLeft'], 
	['derecha', 'turnRight']];

