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

Blockly.Lua.controls_if = function() {
  // If/elseif/else condition.
  var n = 0;
  var argument = Blockly.Lua.valueToCode(this, 'IF' + n, true) || 'false';
  var branch = Blockly.Lua.statementToCode(this, 'DO' + n);
  var code = 'if (' + argument + ') then\n' + branch;
  for (n = 1; n <= this.elseifCount_; n++) {
    argument = Blockly.Lua.valueToCode(this, 'IF' + n, true) || 'false';
    branch = Blockly.Lua.statementToCode(this, 'DO' + n);
    code += 'elseif (' + argument + ') then\n' + branch;
  }
  if (this.elseCount_) {
    branch = Blockly.Lua.statementToCode(this, 'ELSE');
    code += 'else\n' + branch;
  }
  code += 'end';
  return code + '\n';
};

// Blockly.JavaScript.controls_for = function() {
  // // For loop.
  // var variable0 = Blockly.JavaScript.variableDB_.getName(
      // this.getInputVariable('VAR'), Blockly.Variables.NAME_TYPE);
  // var argument0 = Blockly.JavaScript.valueToCode(this, 'FROM', true) || '0';
  // var argument1 = Blockly.JavaScript.valueToCode(this, 'TO', true) || '0';
  // var branch0 = Blockly.JavaScript.statementToCode(this, 'DO');
  // var code;
  // if (argument1.match(/^\w+$/)) {
    // code = 'for (' + variable0 + ' = ' + argument0 + '; ' + variable0 + ' <= ' + argument1 + '; ' + variable0 + '++) {\n' +
        // branch0 + '}\n';
  // } else {
    // // The end value appears to be more complicated than a simple variable.
    // // Cache it to a variable to prevent repeated look-ups.
    // var endVar = Blockly.JavaScript.variableDB_.getDistinctName(
        // variable0 + '_end', Blockly.Variables.NAME_TYPE);
    // code = 'var ' + endVar + ' = ' + argument1 + ';\n' +
        // 'for (' + variable0 + ' = ' + argument0 + '; ' + variable0 + ' <= ' + endVar + '; ' + variable0 + '++) {\n' +
        // branch0 + '}\n';
  // }
  // return code;
// };

// Blockly.JavaScript.controls_forEach = function() {
  // // For each loop.
  // var variable0 = Blockly.JavaScript.variableDB_.getName(
      // this.getInputVariable('VAR'), Blockly.Variables.NAME_TYPE);
  // var argument0 = Blockly.JavaScript.valueToCode(this, 'LIST', true) || '[]';
  // var branch0 = Blockly.JavaScript.statementToCode(this, 'DO');
  // var code;
  // var indexVar = Blockly.JavaScript.variableDB_.getDistinctName(
      // variable0 + '_index', Blockly.Variables.NAME_TYPE);
  // if (argument0.match(/^\w+$/)) {
    // branch0 = '  ' + variable0 + ' = ' + argument0 + '[' + indexVar + '];\n' + branch0;
    // code = 'for (var ' + indexVar + ' in  ' + argument0 + ') {\n' +
        // branch0 + '}\n';
  // } else {
    // // The list appears to be more complicated than a simple variable.
    // // Cache it to a variable to prevent repeated look-ups.
    // var listVar = Blockly.JavaScript.variableDB_.getDistinctName(
        // variable0 + '_list', Blockly.Variables.NAME_TYPE);
    // branch0 = '  ' + variable0 + ' = ' + listVar + '[' + indexVar + '];\n' + branch0;
    // code = 'var ' + listVar + ' = ' + argument0 + ';\n' +
        // 'for (var ' + indexVar + ' in ' + listVar + ') {\n' +
        // branch0 + '}\n';
  // }
  // return code;
// };

Blockly.JavaScript.controls_flow_statements = function() {
  // Flow statements: continue, break.
  switch (this.getTitleValue('FLOW')) {
    case 'BREAK':
      return 'break;\n';
    case 'CONTINUE':
      return 'continue;\n';
  }
  throw 'Unknown flow statement.';
};

Blockly.Lua.controls_sleep = function() {
  // Sleep.
  var value = window.parseFloat(this.getTitleText('NUM'));
  return 'sleep(' + value + ')\n';
};

Blockly.Lua.controls_Behaviour = function() {
  var name = this.getTitleText('TEXT');
  var priority = this.getTitleText('PR');
  var behaviourCode = Blockly.Lua.statementToCode(this, 'BEHAVIOUR_CODE');
  var code = "local M = {}\n" + "local robot = require 'tasks/RobotInterface'\n local sched = require 'sched'\n" + "M.name = '" + name;
  code = code + "'\n" + "M.priority = " + priority + "\n" + "M.init = function(conf)\n" + behaviourCode + "end\n return M"; 

  return code + '\n';
};


Blockly.Lua.controls_whileUntil = function() {
  var argument0 = Blockly.Lua.valueToCode(this, 'BOOL', true) || 'false';
  var branch0 = Blockly.Lua.statementToCode(this, 'DO') || '\n';

  return 'while (' + argument0 + ') do\n' + branch0 + 'end\n';
};

Blockly.Lua.controls_repeat = function() {

  var branch0 = Blockly.Lua.statementToCode(this, 'DO') || '\n';

  return 'for i = 1, ' + this.getTitleText('TIMES') + ' do\n' + branch0 + 'end\n';
};