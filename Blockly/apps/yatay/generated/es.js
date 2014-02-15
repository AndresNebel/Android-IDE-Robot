if (typeof apps == 'undefined') { var apps = {}; }


apps.messages = function(opt_data, opt_ignored, opt_ijData) {
  return '';
};


apps.dialog = function(opt_data, opt_ignored, opt_ijData) {
  return '';
};


apps.codeDialog = function(opt_data, opt_ignored, opt_ijData) {
  return '';
};


apps.storageDialog = function(opt_data, opt_ignored, opt_ijData) {
  return '';
};


apps.ok = function(opt_data, opt_ignored, opt_ijData) {
  return '';
};

;
// This file was automatically generated from template.soy.
// Please don't edit this file by hand.

if (typeof codepage == 'undefined') { var codepage = {}; }


codepage.messages = function(opt_data, opt_ignored, opt_ijData) {
  return apps.messages(null, null, opt_ijData) + '<div style="display: none"><span id="Code_badXml">Error de análisis XML:\n%1\n\nSelecciona OK para abandonar tus cambios o Cancelar para seguir editando el XML.</span><span id="Code_badCode">Error del programa:\n%1</span><span id="Code_timeout">Maximo de iteraciones de ejecución excedidas.</span><span id="Code_discard">Eliminar todos los bloques 1%?</span></div>';
};


codepage.start = function(opt_data, opt_ignored, opt_ijData) {
  return codepage.messages(null, null, opt_ijData) + '<script type="text/javascript" src="../../blockly_compressed.js"><\/script><script type="text/javascript" src="../../javascript_compressed.js"><\/script><script type="text/javascript" src="../../' + soy.$$escapeHtml(opt_ijData.langSrc) + '"><\/script><script type="text/javascript" src="./languages/es.js"><\/script>'+'<script type="text/javascript" src="./generators/lua.js"><\/script><script type="text/javascript" src="./generators/lua/butia.js"><\/script><script type="text/javascript" src="./generators/lua/logic.js"><\/script><script type="text/javascript" src="./generators/lua/math.js"><\/script><script type="text/javascript" src="./generators/lua/variables.js"><\/script><script type="text/javascript" src="./generators/lua/control.js"><\/script><table id="blocklyTable"><tr style="display:none"><td><h1><span id="title"><a href="../index.html">Yatay</span></h1></td><td class="farSide"><select id="languageMenu"></select></td></tr><tr><td colspan=2><button id="linkButton" style="display:none"><button id="runButton" style="display:none"> <button id="trashButton"  style="display:none" title="Descartar todos los bloques."><img src=\'../../media/1x1.gif\' class="trash icon21"></button> </td></tr><tr><td height="100%" colspan=2 id="content_area">' + codepage.toolbox(opt_data, null, opt_ijData) + '</td></tr></table><div id="content_blocks" class="content"></div>' + apps.dialog(null, null, opt_ijData) + apps.storageDialog(null, null, opt_ijData);
};



codepage.toolbox = function(opt_data, opt_ignored, opt_ijData) {
  return '<xml id="toolbox" style="display: none"><category name="Comportamiento"><block type="controls_conditionalBehaviour"><value name="BEHAVIOUR_CONDITION"><block type="controls_behaviourTrigger"></block></value></block><block type="controls_behaviour"></block></category><category name="Control"><block type="controls_if"></block><block type="controls_whileUntil"></block><block type="controls_repeat"></block><block type="controls_sleep"></block></category><category name="Butiá">' + opt_data + '</category><category name="Lógica"><block type="logic_compare"></block><block type="logic_operation"></block><block type="logic_constrain"><value name="LOW"><block type="math_number"><title name="NUM">1</title></block></value><value name="HIGH"><block type="math_number"><title name="NUM">100</title></block></value></block><block type="logic_negate"></block><block type="logic_boolean"></block></category><category name="Matemáticas"><block type="math_number"></block><block type="math_arithmetic"></block><block type="math_single"></block><block type="math_trig"></block><block type="math_round"></block></category><category name="Variables"' /*custom="VARIABLE"*/+'><block type="variables_get"></block><block type="variables_set"></block><block type="variables_sensor_set"></block><block type="variables_sensor_get"></block><block type="variables_print"></block><block type="variables_print_stat"></block></category></xml>';
};


codepage.readonly = function(opt_data, opt_ignored, opt_ijData) {
  return codepage.messages(null, null, opt_ijData) + '<script type="text/javascript" src="../../blockly_compressed.js"><\/script><script type="text/javascript" src="../../blocks_compressed.js"><\/script><script type="text/javascript" src="../../' + soy.$$escapeHtml(opt_ijData.langSrc) + '"><\/script><div id="blockly"></div>';
};
