//Hide #stop & #back menu item 
$(document).ready(function(){	
	$('#stop').hide();
	$('#back').hide();
});
//Handle #docode click
$(document).ready(function(){	
	$('#docode').click(function(){	   		
		$('#docode').toggle('slow');
		$('#ready').toggle('slow');
		$('#back').show('slow');
	});
});
//Handle #back click
$(document).ready(function(){	
	$('#back').click(function(){	   
		$('#back').toggle('slow');
		$('#ready').show('slow');
		$('#docode').show('slow');
	});
});
//Handle #run click
$(document).ready(function(){	
	$('#run').click(function(){	   
		$('#ready').toggle('slow');	
		$('#run').toggle('slow');
		$('#more').toggle('slow');
		$('#stop').show('slow');
	});
});
//Handle #debug click
$(document).ready(function(){	
	$('#debug').click(function(){	   
		$('#ready').toggle('slow');
		$('#run').toggle('slow');
		$('#more').toggle('slow');					
		$('#stop').show('slow');
	});
});
//Handle #stop click
$(document).ready(function(){	
	$('#stop').click(function(){	   
		$('#ready').show('slow');
		$('#run').show('slow');
		$('#more').show('slow');					
		$('#stop').toggle('slow');
	});
});
