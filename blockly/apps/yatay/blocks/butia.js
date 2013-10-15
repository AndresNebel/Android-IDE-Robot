/**
 * Blockly Apps: YataY Blocks
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
 * @fileoverview Blocks for YataY application.
 * @author YataY Group
 */
'use strict';

Blockly.Blocks['butia_move'] = {
	// Block for moving robot butiá forward or backwards.
	init: function() {
		var DIRECTIONS = [
			[Blockly.Msg.BUTIA_MOVE_FORWARD, 'moveForward'], 
			[Blockly.Msg.BUTIA_MOVE_BACKWARD, 'moveBackward']
		];
		this.setHelpUrl(Blockly.Msg.LANG_BUTIA_COMPARE_HELPURL);
		this.setColour(120);
		this.appendDummyInput()
			.appendTitle(Blockly.Msg.CONTROLS_MOVE_TITLE)	
			.appendTitle(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setTooltip(Blockly.Msg.BUTIA_MOVE_TOOLTIP);
	}
};

// Butia Messages
Blockly.Msg.LANG_BUTIA_COMPARE_HELPURL = 'http://www.fing.edu.uy/inco/proyectos/butia/';
Blockly.Msg.CONTROLS_MOVE_TITLE = 'move';
Blockly.Msg.BUTIA_MOVE_FORWARD = 'adelante';
Blockly.Msg.BUTIA_MOVE_BACKWARD = 'atrás';
Blockly.Msg.BUTIA_MOVE_TOOLTIP = 'Mueve el Butiá hacia adelante o atrás.';













