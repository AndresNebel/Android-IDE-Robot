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

	if (BlocklyApps.LANG == 'es') {
		$('#content_blocks').addClass('content-es');	
	} else {
		$('#content_blocks').addClass('content-en');
	}
	
	Yatay.Mobile.initToolbox();
	//Yatay.Mobile.fixConflicts();	
	//setTimeout(function() {Blockly.mainWorkspace.trashcan.dispose();}, 300);
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

	//Binding toolbox slide event
	setTimeout(function() {
		$('.blocklyToolboxDiv').bind('click touchend', function(e) {
			return Yatay.Mobile.slideToolbox(true);	
		});
	}, 1000);
	
	//Override function onMouseDown_ of block.js
	Blockly.Block.prototype.onMouseDown_ = function(e) {
		if (this.isInFlyout) {
			setTimeout(function() { 
				Yatay.Mobile.openToolbox = false;
				$('#content_blocks').removeClass('openToolbox');
				if (Yatay.Common.testMode) { 
					$('#content_blocks').addClass('content-test');
				}		
				Blockly.fireUiEvent(window, 'resize');
			},1000);
			return;
		}
		
		Blockly.svgResize();
		Blockly.terminateDrag_();
		this.select();
		Blockly.hideChaff();
		if (Blockly.isRightButton(e)) {		
			if (Blockly.ContextMenu) {
			  this.showContextMenu_(Blockly.mouseToSvg(e));
			}
		} else if (!this.isMovable()) {
			return;
		} else {
			Blockly.removeAllRanges();
			Blockly.setCursorHand_(true);
			var xy = this.getRelativeToSurfaceXY();
			this.startDragX = xy.x;
			this.startDragY = xy.y;
			this.startDragMouseX = e.clientX;
			this.startDragMouseY = e.clientY;
			Blockly.Block.dragMode_ = 1;
			Blockly.Block.onMouseUpWrapper_ = Blockly.bindEvent_(document,'mouseup', this, this.onMouseUp_);
			Blockly.Block.onMouseMoveWrapper_ = Blockly.bindEvent_(document, 'mousemove', this, this.onMouseMove_);
			this.draggedBubbles_ = [];
			var descendants = this.getDescendants();
			for (var x = 0, descendant; descendant = descendants[x]; x++) {
				var icons = descendant.getIcons();
				for (var y = 0; y < icons.length; y++) {
					var data = icons[y].getIconLocation();
					data.bubble = icons[y];
					this.draggedBubbles_.push(data);
				}
			}
		}
		e.stopPropagation();
	};
	
	//Fix: Blocks superposition
	var resizeTextarea = function() {
		this.style.height = "";
		var $this = $(this),             
        outerHeight = $this.outerHeight(),
        scrollHeight = this.scrollHeight,
        innerHeight = $this.innerHeight(),
        magic = outerHeight - innerHeight;
		this.style.height = scrollHeight + magic + "px";
	}	
	$('textarea').keydown(resizeTextarea).keyup(resizeTextarea).change(resizeTextarea).focus(resizeTextarea);
};

/**
 * Function to solve conflicts betweet libraries and override functions.
 */
//Yatay.Mobile.fixConflicts = function() { };
