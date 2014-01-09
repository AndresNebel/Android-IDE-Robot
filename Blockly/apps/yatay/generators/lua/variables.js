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
 * @fileoverview Generating Lua for variable blocks.
 * @author fraser@google.com (Neil Fraser)
 * Due to the frequency of long strings, the 80-column wrap rule need not apply
 * to language files.
 */

 'use strict';

goog.provide('Blockly.Lua.variables');

goog.require('Blockly.Lua');


Blockly.Lua["variables_get"] = function(block) {
  // Variable getter.
  return Yatay.VariableDB.getName(this.getTitleText('VAR'),
      Blockly.Variables.NAME_TYPE);
};

Blockly.Lua["variables_set"] = function(block) {
  // Variable setter.
  var argument0 = Blockly.Lua.valueToCode(this, 'VALUE', true) || '0';
  var varName = Blockly.Lua.variableDB_.getName(
      this.getTitleText('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + ';\n';
};

Blockly.Lua["variables_text"] = function(block) {
  // Variable setter.
  var argument0 = Blockly.Lua.valueToCode(this, 'VALUE', true) || '0';
  var varName = Blockly.Lua.variableDB_.getName(
      this.getTitleText('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + ';\n';
};


Blockly.Lua["variables_print"] = function(block) {
  // Variable getter.
  var text = block.getTitleValue('TEXT');
  return "print('"+ text +"')\n robot.deliverResultToWebServer('" + text + "')\n";
};
