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

'use strict';

goog.provide('Blockly.Lua.butia');

goog.require('Blockly.Lua');

Blockly.Lua["butia_move"] = function(block) {
	// Generate Lua for moving robot butiá forward or backwards.
	var debugTrace = "";

	if (Yatay.DebugMode)
	{
		debugTrace = "robot.put_debug_result('"+ block.id +"')\n";
	}

	if(block.getTitleValue('DIR') == 'moveForward') {
		return debugTrace + "robot.execute('bb-motors','setvel2mtr', {1,500,1,500})\n";
	}else if(block.getTitleValue('DIR') == 'moveBackward') {
		return debugTrace + "robot.execute('bb-motors','setvel2mtr', {0,500,0,500})\n";
	}
};


Blockly.Lua["butia_turn"] = function(block) {
	var debugTrace = "";

	if (Yatay.DebugMode)
	{
		debugTrace = "robot.put_debug_result('"+ block.id +"')\n";
	}
	// Generate Lua for turning robot butiá left or right.
	if(block.getTitleValue('DIR') == 'turnLeft') {
		return debugTrace + "robot.execute('bb-motors','setvel2mtr', {1,500,0,500})\n";
	}else if(block.getTitleValue('DIR') == 'turnRight') {
		return debugTrace + "robot.execute('bb-motors','setvel2mtr', {0,500,1,500})\n";
	}
};

Blockly.Lua["butia_stop"] = function(block) {
	var debugTrace = "";

	if (Yatay.DebugMode)
	{
		debugTrace = "robot.put_debug_result('"+ block.id +"')\n";
	}
	return debugTrace + "robot.execute('bb-motors','setvel2mtr', {0,0,0,0})";
};

Blockly.Lua["butia_grey"] = function(block) {
	//var sensorRes = "local sensorResult = robot.execute('bb-grey:2','getValue',{})\n";
//	var writeRes = "table.insert(resultsQueue, 1, sensorResult)\n" + "sched.signal('NewResult')\n";
//	return sensorRes + writeRes;
	return "robot.execute('bb-grey:2','getValue',{})";
};

