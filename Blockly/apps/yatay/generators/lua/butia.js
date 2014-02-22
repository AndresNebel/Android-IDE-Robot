/* Automatically Generated Code */
'use strict';

goog.provide('Blockly.Lua.butia');
goog.require('Blockly.Lua');

Blockly.Lua['medir distancia (3)'] = function(block) { 
	var debugTrace = ''; 
	return debugTrace + "robot.execute('bb-distanc:3','getValue',{}, M.userId)"; 
}; 

Blockly.Lua['sensor de grises (1)'] = function(block) { 
	var debugTrace = ''; 
	return debugTrace + "robot.execute('bb-grey:1','getValue',{}, M.userId)"; 
}; 

Blockly.Lua['boton (2)'] = function(block) { 
	var debugTrace = ''; 
	return debugTrace + "robot.execute('bb-button:2','getValue',{}, M.userId)"; 
}; 

Blockly.Lua['mover adelante'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"', M.userId)\n"; 
	} 
	return debugTrace + "robot.execute('bb-motors','setvel2mtr',{1,500,1,500}, M.userId)"; 
}; 

Blockly.Lua['mover atras'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"', M.userId)\n"; 
	} 
	return debugTrace + "robot.execute('bb-motors','setvel2mtr',{0,500,0,500}, M.userId)"; 
}; 

Blockly.Lua['girar izquierda'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"', M.userId)\n"; 
	} 
	return debugTrace + "robot.execute('bb-motors','setvel2mtr',{1,500,0,500}, M.userId)"; 
}; 

Blockly.Lua['girar derecha'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"', M.userId)\n"; 
	} 
	return debugTrace + "robot.execute('bb-motors','setvel2mtr',{0,500,1,500}, M.userId)"; 
}; 

Blockly.Lua['girar'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"', M.userId)\n"; 
	} 
	var arg1 = Blockly.Lua.statementToCode(block, '1') || '0'; 
	var arg2 = Blockly.Lua.statementToCode(block, '2') || '0'; 
	var arg3 = Blockly.Lua.statementToCode(block, '3') || '0'; 
	var arg4 = Blockly.Lua.statementToCode(block, '4') || '0'; 
	return debugTrace + "robot.execute('bb-motors','setvel2mtr',{" + arg1 + ", " + arg2 + ", " + arg3 + ", " + arg4 + "}, M.userId)"; 
}; 

