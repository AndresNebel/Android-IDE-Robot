/**
 * @fileoverview 
 * @author 
 */

 if (!Yatay.Mobile){ 
	Yatay.Mobile = {};
} 

/**
 * Toolbox state  
 * @type {bool}
 */
Yatay.Mobile.openToolbox = false;

/**
 * Initialize Yatay on ready
 */
$(document).ready(function(){	   
	$('#main_menu').load('./bodies/mobile.html');
	$('#dialogs').load('./bodies/dialogs.html', Yatay.Common.loadDialogs);
	
	//Yatay.Common.setCookie('idUser', '', 1);
	if (Yatay.Common.getCookie("idUser") == '') { 
		Yatay.Common.requestUserId();
	}

	Yatay.Mobile.initToolbox();
	//Yatay.Mobile.fixConflicts();
	
	setTimeout(function() {Blockly.mainWorkspace.trashcan.dispose();}, 300);
});

/**
 * Open (slide right) toolbox.
 */
Yatay.Mobile.slideToolbox = function(resize) {
	if (!Yatay.Mobile.openToolbox) {
		$('#content_blocks').addClass('openToolbox');
		if (resize) {
			Blockly.fireUiEvent(window, 'resize');
		}
		Yatay.Mobile.openToolbox = true;
		return false;
	}
	return true;
};

/**
 * Initialize slide toolbox.
 */
Yatay.Mobile.initToolbox = function() {

	//Override function onMouseDown of Blockly toolbox.js
	setTimeout(function() {
		$('.blocklyToolboxDiv').bind('click touchend', function(e) {
			return Yatay.Mobile.slideToolbox(true);	
		});
	}, 1000);

	//Override function createBlockFunc_ of Blockly flyout.js
	Blockly.Flyout.prototype.createBlockFunc_ = function(originBlock) {
		if (Yatay.Mobile.openToolbox) {
			var flyout = this;
			var result = function(e) {
				if (Blockly.isRightButton(e)) {
					// Right-click.  Don't create a block, let the context menu show.
					return;
				}
				if (originBlock.disabled) {
					// Beyond capacity.
					return;
				}
				// Create the new block by cloning the block in the flyout (via XML).
				var xml = Blockly.Xml.blockToDom_(originBlock);
				var block = Blockly.Xml.domToBlock_(flyout.targetWorkspace_, xml);
				// Place it in the same spot as the flyout copy.
				var svgRootOld = originBlock.getSvgRoot();
				if (!svgRootOld) {
					throw 'originBlock is not rendered.';
				}
				var xyOld = Blockly.getSvgXY_(svgRootOld);
				var svgRootNew = block.getSvgRoot();
				if (!svgRootNew) {
					throw 'block is not rendered.';
				}
				var xyNew = Blockly.getSvgXY_(svgRootNew);
				block.moveBy(xyOld.x - xyNew.x, xyOld.y - xyNew.y);
				if (flyout.autoClose) {
					flyout.hide();
				} else {
					flyout.filterForCapacity_();
				}
				// Start a dragging operation on the new block.
				block.onMouseDown_(e);
			}
			setTimeout(function() { 
				Yatay.Mobile.openToolbox = false;
				$('#content_blocks').removeClass('openToolbox');
				if (Yatay.Common.testMode) { 
					$('#content_blocks').addClass('content-test');
				}		
				Blockly.fireUiEvent(window, 'resize');
			},1000);
		}
		return result;
	}
};

/**
 * Function to solve conflicts betweet libraries and override functions.
 */
//Yatay.Mobile.fixConflicts = function() { };
