//Java Script to load tablet resources 
$(document).ready(function(){	   
	$('#main_menu').load('yatay/tablet.html');	
});
//Handle docode click
function docode(){	
	toLua();
};
//Handle run click
function run(){	
	//execute();
	$('#robotest').toggle('slow');
	$('#debug').toggle('slow');	   
	$('#run').toggle('slow');			
	$('#load').toggle('slow');
	$('#save').toggle('slow');		
	if($('#docode').is(":visible")) {			
		$('#docode').toggle('slow');
	}
	$('#stop').toggle('slow');
};
//Handle debug click
function debug(){		   
	$('#robotest').toggle('slow');
	$('#debug').toggle('slow');	   
	$('#run').toggle('slow');			
	$('#load').toggle('slow');
	$('#save').toggle('slow');
	if($('#docode').is(":visible")) {			
		$('#docode').toggle('slow');
	}
	$('#stop').toggle();
};
//Handle stop click
function stop(){		   
	$('#robotest').toggle('slow');
	$('#debug').toggle('slow');	   
	$('#run').toggle('slow');			
	$('#docode').toggle('slow');
	$('#load').toggle('slow');
	$('#save').toggle('slow');
	$('#stop').toggle('slow');
};
//Handle robotest click
function robotest(){		   

};
