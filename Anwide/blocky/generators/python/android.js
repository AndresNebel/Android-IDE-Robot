Blockly.Python.android_speak = function() {
  // String length.
  var argument0 = Blockly.Python.valueToCode(this, 'VALUE', true) || '\'\'';
  return 'droid.ttsSpeak(' + argument0 + ')\n';
};

Blockly.Python.android_toast = function() {
  var argument0 = Blockly.Python.valueToCode(this, 'VALUE', true) || '\'\'';
  return 'droid.makeToast(' + argument0 + ')\n';
};