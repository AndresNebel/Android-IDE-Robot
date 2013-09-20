Blockly.Language.capture_picture = {
  category: 'Android',
  helpUrl: 'http://code.google.com/p/android-scripting/wiki/ApiReference#cameraCapturePicture',
  init: function() {
    this.setColour(290);
    this.appendTitle('take picture at');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendInput('', Blockly.INPUT_VALUE, 'VALUE', String);
    this.setTooltip('Take a picture and save it to the specified path');
  }
};

Blockly.Language.get_input = {
  category: 'Android',
  helpUrl: 'http://code.google.com/p/android-scripting/wiki/ApiReference#dialogGetInput',
  init: function() {
    this.setColour(290);
    this.appendTitle('get input');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendInput('', Blockly.INPUT_VALUE, 'VALUE', String);
    this.setTooltip('Queries the user for a text input');
  }
};