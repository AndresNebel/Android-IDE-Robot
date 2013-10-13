/**
 * Visual Blocks Language
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
 * @fileoverview Helper functions for generating lua for blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.lua');

goog.require('Blockly.Generator');


Blockly.lua = new Blockly.Generator('lua');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.lua.addReservedWords(
	// import keyword
	// print ','.join(keyword.kwlist)
	// http://www.lua.org/manual/5.1/manual.html
'and,break,do,else,elseif,end,false,for,function,if,in,local,nil,not,or,repeat,return,then,true,until,while';
	//TODO: define constants
	//TODO: define functions
 
/**
 * Order of operation ENUMs.
 * http://docs.lua.org/reference/expressions.html#summary
 */
Blockly.lua.ORDER_ATOMIC = 0;            // 0 "" ...
Blockly.lua.ORDER_COLLECTION = 1;        // tuples, lists, dictionaries
Blockly.lua.ORDER_STRING_CONVERSION = 1; // `expression...`
Blockly.lua.ORDER_MEMBER = 2;            // . []
Blockly.lua.ORDER_FUNCTION_CALL = 2;     // ()
Blockly.lua.ORDER_EXPONENTIATION = 3;    // **
Blockly.lua.ORDER_UNARY_SIGN = 4;        // + -
Blockly.lua.ORDER_BITWISE_NOT = 4;       // ~
Blockly.lua.ORDER_MULTIPLICATIVE = 5;    // * / // %
Blockly.lua.ORDER_ADDITIVE = 6;          // + -
Blockly.lua.ORDER_BITWISE_SHIFT = 7;     // << >>
Blockly.lua.ORDER_BITWISE_AND = 8;       // &
Blockly.lua.ORDER_BITWISE_XOR = 9;       // ^
Blockly.lua.ORDER_BITWISE_OR = 10;       // |
Blockly.lua.ORDER_RELATIONAL = 11;       // in, not in, is, is not,
                                            //     <, <=, >, >=, <>, !=, ==
Blockly.lua.ORDER_LOGICAL_NOT = 12;      // not
Blockly.lua.ORDER_LOGICAL_AND = 13;      // and
Blockly.lua.ORDER_LOGICAL_OR = 14;       // or
Blockly.lua.ORDER_CONDITIONAL = 15;      // if else
Blockly.lua.ORDER_LAMBDA = 16;           // lambda
Blockly.lua.ORDER_NONE = 99;             // (...)

/**
 * Arbitrary code to inject into locations that risk causing infinite loops.
 * Any instances of '%1' will be replaced by the block ID that failed.
 * E.g. '  checkTimeout(%1)\n'
 * @type ?string
 */
Blockly.lua.INFINITE_LOOP_TRAP = null;

/**
 * This is used as a placeholder in functions defined using
 * Blockly.lua.provideFunction_.  It must not be legal code that could
 * legitimately appear in a function definition (or comment), and it must
 * not confuse the regular expression parser.
 */
Blockly.lua.FUNCTION_NAME_PLACEHOLDER_ = '{{{}}}';
Blockly.lua.FUNCTION_NAME_PLACEHOLDER_REGEXP_ =
    new RegExp(Blockly.lua.FUNCTION_NAME_PLACEHOLDER_, 'g');

/**
 * Initialise the database of variable names.
 */
Blockly.lua.init = function() {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.lua.definitions_ = {};
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.lua.functionNames_ = {};

  if (Blockly.Variables) {
    if (!Blockly.lua.variableDB_) {
      Blockly.lua.variableDB_ =
          new Blockly.Names(Blockly.lua.RESERVED_WORDS_);
    } else {
      Blockly.lua.variableDB_.reset();
    }

    var defvars = [];
    var variables = Blockly.Variables.allVariables();
    for (var x = 0; x < variables.length; x++) {
      defvars[x] = Blockly.lua.variableDB_.getName(variables[x],
          Blockly.Variables.NAME_TYPE) + ' = None';
    }
    Blockly.lua.definitions_['variables'] = defvars.join('\n');
  }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.lua.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var imports = [];
  var definitions = [];
  for (var name in Blockly.lua.definitions_) {
    var def = Blockly.lua.definitions_[name];
    if (def.match(/^(from\s+\S+\s+)?import\s+\S+/)) {
      imports.push(def);
    } else {
      definitions.push(def);
    }
  }
  var allDefs = imports.join('\n') + '\n\n' + definitions.join('\n\n');
  return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.lua.scrubNakedValue = function(line) {
  return line + '\n';
};

/**
 * Encode a string as a properly escaped lua string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} lua string.
 * @private
 */
Blockly.lua.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\%/g, '\\%')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Common tasks for generating lua from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The lua code created for this block.
 * @return {string} lua code with comments and subsequent blocks added.
 * @this {Blockly.CodeGenerator}
 * @private
 */
Blockly.lua.scrub_ = function(block, code) {
  if (code === null) {
    // Block has handled code generation itself.
    return '';
  }
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += this.prefixLines(comment, '# ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = this.allNestedComments(childBlock);
          if (comment) {
            commentCode += this.prefixLines(comment, '# ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = this.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Define a function to be included in the generated code.
 * The first time this is called with a given desiredName, the code is
 * saved and an actual name is generated.  Subsequent calls with the
 * same desiredName have no effect but have the same return value.
 *
 * It is up to the caller to make sure the same desiredName is not
 * used for different code values.
 *
 * The code gets output when Blockly.lua.finish() is called.
 *
 * @param {string} desiredName The desired name of the function (e.g., isPrime).
 * @param {code} A list of lua statements.
 * @return {string} The actual name of the new function.  This may differ
 *     from desiredName if the former has already been taken by the user.
 * @private
 */
Blockly.lua.provideFunction_ = function(desiredName, code) {
  if (!Blockly.lua.definitions_[desiredName]) {
    var functionName = Blockly.lua.variableDB_.getDistinctName(
        desiredName, Blockly.Generator.NAME_TYPE);
    Blockly.lua.functionNames_[desiredName] = functionName;
    Blockly.lua.definitions_[desiredName] = code.join('\n').replace(
        Blockly.lua.FUNCTION_NAME_PLACEHOLDER_REGEXP_, functionName);
  }
  return Blockly.lua.functionNames_[desiredName];
};
