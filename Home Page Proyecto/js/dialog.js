$(document).ready(function () {
	$('a.btn-ok, #dialog-overlay, #dialog-box').click(function () {		
		$('#dialog-overlay, #dialog-box').hide();		
		return false;
	});
		
	$(window).resize(function () {
		if (!$('#dialog-box').is(':hidden')) popup();		
	});				
});

function dismissPopupAndNaviagate(hrefLoc)
{
	dismissPopup();
	window.location.href = hrefLoc;
}

function dismissPopup()
{
	$('#dialog-overlay, #dialog-box').hide();		
	$('#dialog-message').html('');		
}

function popup(message) {
	
	var maskHeight = $(document).height();  
	var maskWidth = $(window).width();
	var dialogTop =  (maskHeight/1.2) - ($('#dialog-box').height());  
	var dialogLeft = (maskWidth/2) - ($('#dialog-box').width()/2); 
	
	$('#dialog-overlay').css({height:maskHeight, width:maskWidth}).show();
	$('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();
	$('#dialog-message').html(message);					
	$('html,body').animate({scrollTop: $('#dialog-box').offset().top -50}, 'slow');
}