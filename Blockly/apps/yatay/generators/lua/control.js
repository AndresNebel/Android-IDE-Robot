/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://code.google.com/p/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use block file except in compliance with the License.
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

goog.provide('Blockly.Lua.controls');

goog.require('Blockly.Lua');

Blockly.Lua["controls_if"] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var argument = Blockly.Lua.statementToCode(block, 'IF' + n, true) || 'false';
  var branch = Blockly.Lua.statementToCode(block, 'DO' + n);
  var code = 'if (' + argument.trimLeft() + ') then\n' + branch;
  for (n = 1; n <= block.elseifCount_; n++) {
    argument = Blockly.Lua.valueToCode(block, 'IF' + n, true) || 'false';
    branch = Blockly.Lua.statementToCode(block, 'DO' + n);
    code += 'elseif (' + argument + ') then\n' + branch;
  }
  if (block.elseCount_) {
    branch = Blockly.Lua.statementToCode(block, 'ELSE');
    code += 'else\n' + branch;
  }
  code += '\n' + 'end';
  return code + '\n';
};

Blockly.Lua["controls_flow_statements"] = function(block) {
  // Flow statements: continue, break.
  switch (block.getTitleValue('FLOW')) {
    case 'BREAK':
      return 'break;\n';
    case 'CONTINUE':
      return 'continue;\n';
  }
  throw 'Unknown flow statement.';
};

Blockly.Lua["controls_sleep"] = function(block) {
  // Sleep.
  var value = window.parseFloat(block.getTitleValue('NUM'));
  return 'sleep(' + value + ')\n';
};

Blockly.Lua["controls_Behaviour"] = function(block) {
  var name = block.getTitleValue('TEXT');
  var priority = block.getTitleValue('PR');
  var behaviourCode = Blockly.Lua.statementToCode(block, 'BEHAVIOUR_CODE');
  var code = "local behaviours = require 'catalog'.get_catalog('behaviours')\n" +
  "local M = {}\n" +
  "local robot = require 'tasks/RobotInterface'\n" +
  "local sched = require 'sched'\n" + 
  "M.name = '" + name + "'\n" +
  "M.priority = " + priority + "\n" +
  "local run = function ()\n" +
  "if (activeBehaviour == nil || M.priority > activeBehaviour.priority) then\n" +
  "activeBehaviour = M\n " + 
  behaviourCode +
  "end\n" +
  "end\n"+

  "M.ReleaseControl = function()\n" +
  "   robot.execute('bb-motors','setvel2mtr', [0,0,0,0])\n" +
  "end\n" +

  "M.init = function(conf)\n" +
  "	  local waitd = {emitter='*', events={'Compete!'}}\n" +
  "	  M.task = sched.sigrun(waitd, run)\n" +
  "end\n" +
  "return M\n"; 

  return code;
};


Blockly.Lua["controls_whileUntil"] = function(block) {
  var argument0 = Blockly.Lua.valueToCode(block, 'BOOL', true) || 'false';
  var branch0 = Blockly.Lua.statementToCode(block, 'DO') || '\n';

  return 'while (' + argument0 + ') do\n' + branch0 + 'end\n';
};

Blockly.Lua["controls_repeat"] = function(block) {

  var branch0 = Blockly.Lua.statementToCode(block, 'DO') || '\n';

  return 'for i = 1, ' + block.getTitleValue('TIMES') + ' do\n' + branch0 + 'end\n';
};
