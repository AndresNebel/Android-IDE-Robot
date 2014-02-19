/**
 * @fileoverview 
 * @author 
 */

if (!Yatay.Tablet){ 
	Yatay.Tablet = {};
}

Yatay.Tablet.hide = 0;

/**
 * Initialize Yatay on ready
 */
$(document).ready(function() {	
	$('#main_menu').load('./bodies/tablet.html');
	$('#dialogs').load('./bodies/dialogs.html', Yatay.Common.loadDialogs);
	
	var list = $('<ul class="nav" id="bx_list"></ul>');
	list.appendTo($('#behaviours_popup'));
	
	//Yatay.Common.setCookie('idUser', '', 1);
	if (Yatay.Common.getCookie("idUser") == '') { 
		Yatay.Common.requestUserId();
	}

	Yatay.Tablet.fixConflicts();
});

/**
 * Initialize and start the tour
 */
Yatay.Tablet.takeTour = function() {
	$('.blocklyToolboxDiv').addClass('bootstro');
	$('.blocklyToolboxDiv').attr('data-bootstro-step', '0');
	$('.blocklyToolboxDiv').attr('data-bootstro-width', '600px');
	$('.blocklyToolboxDiv').attr('data-bootstro-placement', 'right');
	$('.blocklyToolboxDiv').attr('data-bootstro-title', Yatay.Msg.TOUR_TOOLBOX_TITLE);
	$('.blocklyToolboxDiv').attr('data-bootstro-content', Yatay.Msg.TOUR_TOOLBOX_CONTENT);

	$('#btn_robotest').addClass('bootstro');
	$('#btn_robotest').attr('data-bootstro-step', '1');
	$('#btn_robotest').attr('data-bootstro-width', '400px');
	$('#btn_robotest').attr('data-bootstro-placement', 'right');
	$('#btn_robotest').attr('data-bootstro-title', Yatay.Msg.TOUR_RBTEST_TITLE);
	$('#btn_robotest').attr('data-bootstro-content', Yatay.Msg.TOUR_RBTEST_CONTENT);

	$('#btn_run').addClass('bootstro');
	$('#btn_run').attr('data-bootstro-step', '2');
	$('#btn_run').attr('data-bootstro-width', '600px');
	$('#btn_run').attr('data-bootstro-placement', 'right');
	$('#btn_run').attr('data-bootstro-title', Yatay.Msg.TOUR_RUN_TITLE);
	$('#btn_run').attr('data-bootstro-content', Yatay.Msg.TOUR_RUN_CONTENT);

	$('#btn_bx_ready').addClass('bootstro');
	$('#btn_bx_ready').attr('data-bootstro-step', '3');
	$('#btn_bx_ready').attr('data-bootstro-width', '400px');
	$('#btn_bx_ready').attr('data-bootstro-placement', 'right');
	$('#btn_bx_ready').attr('data-bootstro-title', Yatay.Msg.TOUR_BXREADY_TITLE);
	$('#btn_bx_ready').attr('data-bootstro-content', Yatay.Msg.TOUR_BXREADY_CONTENT);

	$('#btn_edit').addClass('bootstro');
	$('#btn_edit').attr('data-bootstro-step', '4');
	$('#btn_edit').attr('data-bootstro-width', '400px');
	$('#btn_edit').attr('data-bootstro-placement', 'right');
	$('#btn_edit').attr('data-bootstro-title', Yatay.Msg.TOUR_EDIT_TITLE);
	$('#btn_edit').attr('data-bootstro-content', Yatay.Msg.TOUR_EDIT_CONTENT);

	bootstro.start('.bootstro', {
		nextButton: '<button class="btn btn-primary btn-mini bootstro-next-btn">'+ Yatay.Msg.TOUR_NEXT +'</button>',
		prevButton: '<button class="btn btn-primary btn-mini bootstro-prev-btn">'+ Yatay.Msg.TOUR_PREV +'</button>',
		finishButton: ''
	});
};

/**
 * Function to solve conflicts betweet libraries.
 */
Yatay.Tablet.fixConflicts = function() {
	//Fix: Blockly vs Bootstrap touch events conflict on Chrome.
	Blockly.bindEvent_ = function(a,b,c,d){ 
		Blockly.bindEvent_.TOUCH_MAP = {
			mousedown:"touchstart",
			mousemove:"touchmove",
			mouseup:"touchend"
		};	
		var e=[],f; 
		if(!a.addEventListener)
			throw"Element is not a DOM node with addEventListener.";
		
		f = function(a) { 
			d.apply(c,arguments)
		};
		
		a.addEventListener(b,f,!1);
		e.push([a,b,f]);
		b in Blockly.bindEvent_.TOUCH_MAP && ( 
			f=function(a) { 
				if(1==a.changedTouches.length) { 
					var b=a.changedTouches[0];
					a.clientX=b.clientX;
					a.clientY=b.clientY
				}
				d.apply(c,arguments);
				//This line solves the conflict.
				if (a.target.ownerSVGElement != undefined) {
					a.preventDefault();
				}
			}
			, a.addEventListener(Blockly.bindEvent_.TOUCH_MAP[b],f,!1)
			, e.push([a,Blockly.bindEvent_.TOUCH_MAP[b],f]));
		return e
	};
	
	//Fix: Long taps to open the toolbox on Android Browser.
	Blockly.Toolbox.TreeControl.prototype.setSelectedItem = function(node) {
	  if (this.selectedItem_ == node) {
		return;
	  }
	  goog.ui.tree.TreeControl.prototype.setSelectedItem.call(this, node);
	  if (node && node.blocks && node.blocks.length) {
		Blockly.Toolbox.flyout_.show(node.blocks);
	  } 
	  //Comment this resolves the conflict.
	  /* else {
		//Blockly.Toolbox.flyout_.hide();
	  } */
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
