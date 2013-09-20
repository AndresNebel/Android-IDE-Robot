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
 * @fileoverview Generating Lua for control blocks.
 * @author fraser@google.com (Neil Fraser)
 * Due to the frequency of long strings, the 80-column wrap rule need not apply
 * to language files.
 */

Blockly.Lua = Blockly.Generator.get('Lua');

Blockly.Lua.butia_move = function() {
	// Generate Lua for moving robot butiá forward or backwards.
	var code = 'local motors = toribio.wait_for_device(\'bb-motors\')\n';
	if(this.getTitleValue('DIR') == 'moveForward') {
		return code + 'motors.setvel2mtr(1,500,1,500)\n';
	}else if(this.getTitleValue('DIR') == 'moveBackward') {
		return code + 'motors.setvel2mtr(0,500,0,500)\n';
	}
};


Blockly.Lua.butia_turnLeftRight = function() {
	// Generate Lua for turning robot butiá left or right.
	var code = 'local motors = toribio.wait_for_device(\'bb-motors\')\n';
	if(this.getTitleValue('DIR') == 'turnLeft') {
		return code + 'motors.setvel2mtr(1,500,0,500)\n';
	}else if(this.getTitleValue('DIR') == 'turnRight') {
		return code + 'motors.setvel2mtr(0,500,1,500)\n';
	}
};

