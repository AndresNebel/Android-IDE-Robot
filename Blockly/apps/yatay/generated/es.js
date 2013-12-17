// This file was automatically generated from common.soy.
// Please don't edit this file by hand.

if (typeof apps == 'undefined') { var apps = {}; }


apps.messages = function(opt_data, opt_ignored, opt_ijData) {
  return '<div style="display: none"><span id="subtitle">un entorno de programación visual</span><span id="blocklyMessage">Blockly</span><span id="codeTooltip">Mira el código JavaScript generado.</span><span id="linkTooltip">Guarda conexión a los bloques. </span><span id="runTooltip">Ejecute el programa definido por los bloques en \\nel área de trabajo. </span><span id="runProgram">Ejecutar el programa</span><span id="resetProgram">Restablecer</span><span id="dialogOk">Aceptar</span><span id="dialogCancel">Cancelar</span><span id="catLogic">Lógica</span><span id="catLoops">Secuencias</span><span id="catMath">Matemáticas</span><span id="Yatay_discard">¿Deseas borrar todos los bloques?</span><span id="catText">Texto</span><span id="catLists">Lista</span><span id="catColour">Color</span><span id="catVariables">Variables</span><span id="catProcedures">Procedimientos</span><span id="httpRequestError">Hubo un problema con la petición.</span><span id="linkAlert">Comparte tus bloques con esta conexión:\n\n%1</span><span id="hashError">Lo siento, el \'%1\' no corresponde con ningún archivo Blockly guardado.</span><span id="xmlError">No se pudo cargar el archivo guardado.  ¿Quizá fue creado con otra versión de Blockly?</span><span id="listVariable">lista</span><span id="textVariable">texto</span></div>';
};


apps.dialog = function(opt_data, opt_ignored, opt_ijData) {
  return '<div id="dialogShadow" class="dialogAnimate"></div><div id="dialogBorder"></div><div id="dialog"></div>';
};


apps.codeDialog = function(opt_data, opt_ignored, opt_ijData) {
  return '<div id="dialogCode" class="dialogHiddenContent"><pre id="containerCode"></pre>' + apps.ok(null, null, opt_ijData) + '</div>';
};


apps.storageDialog = function(opt_data, opt_ignored, opt_ijData) {
  return '<div id="dialogStorage" class="dialogHiddenContent"><div id="containerStorage"></div>' + apps.ok(null, null, opt_ijData) + '</div>';
};


apps.ok = function(opt_data, opt_ignored, opt_ijData) {
  return '<div class="farSide" style="padding: 1ex 3ex 0"><button class="secondary" onclick="BlocklyApps.hideDialog(true)">Aceptar</button></div>';
};

;
// This file was automatically generated from template.soy.
// Please don't edit this file by hand.

if (typeof codepage == 'undefined') { var codepage = {}; }


codepage.messages = function(opt_data, opt_ignored, opt_ijData) {
  return apps.messages(null, null, opt_ijData) + '<div style="display: none"><span id="Code_badXml">Error de análisis XML:\n%1\n\nSelecciona OK para abandonar tus cambios o Cancelar para seguir editando el XML.</span><span id="Code_badCode">Error del programa:\n%1</span><span id="Code_timeout">Maximo de iteraciones de ejecución excedidas.</span><span id="Code_discard">Eliminar todos los bloques 1%?</span></div>';
};


codepage.start = function(opt_data, opt_ignored, opt_ijData) {
  return codepage.messages(null, null, opt_ijData) + '<script type="text/javascript" src="../../blockly_compressed.js"><\/script><script type="text/javascript" src="../../javascript_compressed.js"><\/script><script type="text/javascript" src="../../' + soy.$$escapeHtml(opt_ijData.langSrc) + '"><\/script><script type="text/javascript" src="./languages/es.js"><\/script>'+'<script type="text/javascript" src="./generators/lua.js"><\/script><script type="text/javascript" src="./generators/lua/butia.js"><\/script><script type="text/javascript" src="./generators/lua/logic.js"><\/script><script type="text/javascript" src="./generators/lua/math.js"><\/script><script type="text/javascript" src="./generators/lua/variables.js"><\/script><script type="text/javascript" src="./generators/lua/control.js"><\/script><table width="47%" height="90%" style="margin-left:25.2%; margin-top:4.5%"><tr style="display:none"><td><h1><span id="title"><a href="../index.html">Blockly</a> : Codigo</span></h1></td><td class="farSide"><select id="languageMenu"></select></td></tr><tr><td colspan=2><button id="linkButton" style="display:none"><button id="runButton" style="display:none"> <button id="trashButton"  style="display:none" title="Descartar todos los bloques."><img src=\'../../media/1x1.gif\' class="trash icon21"></button> </td></tr><tr><td height="100%"  colspan=2 id="content_area">' + codepage.toolbox(null, null, opt_ijData) + '</td></tr></table><div id="content_blocks" class="content"></div><pre id="content_javascript" class="content"></pre><pre id="content_python" class="content"></pre><textarea id="content_xml" class="content" wrap="off"></textarea>' + apps.dialog(null, null, opt_ijData) + apps.storageDialog(null, null, opt_ijData);
};



codepage.toolbox = function(opt_data, opt_ignored, opt_ijData) {
  return '<xml id="toolbox" style="display: none"><category name="Control"><block type="controls_Behaviour"></block><block type="controls_if"></block><block type="controls_whileUntil"></block><block type="controls_repeat"></block><block type="controls_sleep"></block></category><category name="Butiá"><block type="butia_move"></block><block type="butia_turn"></block><block type="butia_stop"></block><block type="butia_grey"></block></category><category name="Lógica"><block type="logic_compare"></block><block type="logic_operation"></block><block type="logic_negate"></block><block type="logic_boolean"></block></category><category name="Matemáticas"><block type="math_number"></block><block type="math_arithmetic"></block><block type="math_single"></block><block type="math_trig"></block><block type="math_constrain"><value name="LOW"><block type="math_number"><title name="NUM">1</title></block></value><value name="HIGH"><block type="math_number"><title name="NUM">100</title></block></value></block><block type="math_round"></block></category><category name="Variables" custom="VARIABLE"><block type="variables_get"></block><block type="variables_set"></block><block type="variables_text"></block></category></xml>';
};


codepage.readonly = function(opt_data, opt_ignored, opt_ijData) {
  return codepage.messages(null, null, opt_ijData) + '<script type="text/javascript" src="../../blockly_compressed.js"><\/script><script type="text/javascript" src="../../blocks_compressed.js"><\/script><script type="text/javascript" src="../../' + soy.$$escapeHtml(opt_ijData.langSrc) + '"><\/script><div id="blockly"></div>';
};
