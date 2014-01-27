/* Automatically Generated Code */
'use strict';

goog.provide('Blockly.Lua.butia');
goog.require('Blockly.Lua');

Blockly.Lua['medir distancia'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"')\n"; 
	} 
	return debugTrace + "robot.execute('bb-distanc:3','getValue',{})"; 
}; 

Blockly.Lua['sensor de grises'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"')\n"; 
	} 
	return "robot.execute('bb-grey:2','getValue',{})"; 
}; 

Blockly.Lua['boton'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"')\n"; 
	} 
	return "robot.execute('bb-button:4','getValue',{})"; 
}; 

Blockly.Lua['mover adelante'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"')\n"; 
	} 
	return debugTrace + "robot.execute('bb-motors','setvel2mtr',{1,500,1,500})"; 
}; 

Blockly.Lua['mover atras'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"')\n"; 
	} 
	return debugTrace + "robot.execute('bb-motors','setvel2mtr',{0,500,0,500})"; 
}; 

Blockly.Lua['girar izquierda'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"')\n"; 
	} 
	return debugTrace + "robot.execute('bb-motors','setvel2mtr',{1,500,0,500})"; 
}; 

Blockly.Lua['girar derecha'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"')\n"; 
	} 
	return debugTrace + "robot.execute('bb-motors','setvel2mtr',{0,500,1,500})"; 
}; 

Blockly.Lua['girar'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"')\n"; 
	} 
	var arg1 = Blockly.Lua.statementToCode(this, '1', true) || '0'; 
	var arg2 = Blockly.Lua.statementToCode(this, '2', true) || '0'; 
	var arg3 = Blockly.Lua.statementToCode(this, '3', true) || '0'; 
	var arg4 = Blockly.Lua.statementToCode(this, '4', true) || '0'; 
	return debugTrace + "robot.execute('bb-motors','setvel2mtr',{" + arg1 + ", " + arg2 + ", " + arg3 + ", " + arg4 + "})"; 
}; 

