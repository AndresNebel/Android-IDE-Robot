//Hide #back & #stop menu item 
$(document).ready(function(){	
	$('#back').hide();
	$('#stop').hide();
	$('#blockly_menu').hide();
});
//Handle #docode click
$(document).ready(function(){	
	$('#docode').click(function(){	   		
		$('#docode').toggle('slow');
		$('#back').toggle('slow');
		$('#blockly_menu').toggle('slow');
	});
});
//Handle #back click
$(document).ready(function(){	
	$('#back').click(function(){	   
		$('#back').toggle('slow');
		$('#docode').toggle('slow');
		$('#blockly_menu').toggle('slow');
	});
});
//Handle #run click
$(document).ready(function(){	
	$('#run').click(function(){
		$('#robotest').toggle('slow');
		$('#debug').toggle('slow');	   
		$('#run').toggle('slow');			
		$('#load').toggle('slow');
		$('#save').toggle('slow');		
		if($('#back').is(":visible")) {			
			$('#back').toggle('slow');
		}
		if($('#docode').is(":visible")) {			
			$('#docode').toggle('slow');
		}
		$('#stop').toggle('slow');
	});
});
//Handle #debug click
$(document).ready(function(){	
	$('#debug').click(function(){	   
		$('#robotest').toggle('slow');
		$('#debug').toggle('slow');	   
		$('#run').toggle('slow');			
		$('#load').toggle('slow');
		$('#save').toggle('slow');
		if($('#back').is(":visible")) {			
			$('#back').toggle('slow');
		}
		if($('#docode').is(":visible")) {			
			$('#docode').toggle('slow');
		}
		$('#stop').toggle();
	});
});
//Handle #stop click
$(document).ready(function(){	
	$('#stop').click(function(){	   
		$('#robotest').toggle('slow');
		$('#debug').toggle('slow');	   
		$('#run').toggle('slow');			
		$('#docode').toggle('slow');
		$('#load').toggle('slow');
		$('#save').toggle('slow');
		$('#stop').toggle('slow');
	});
});

