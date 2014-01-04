/**
 * @fileoverview 
 * @author 
 */

if (!Yatay.Common){ 
	Yatay.Common = {};
} 

/**
 * Send task to server
 */
Yatay.Common.sendTasks = function(code) {
	var values = escape(code).replace(/\./g, "%2E").replace(/\*/g,"%2A");
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'init', code:values},
		success: function() {
			//alert("success");
		},
		error:function() {
			$("#spnResSensor").text('Intenta ejecutar otra vez.');
			$('#divResults').show();
		}
	});
}

/**
 * Kill all tasks running
 */
Yatay.Common.killTasks = function() {
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'kill', code:''},
		success: function(content){
			//alert("success");
		},
		error:function(){
			//alert("failure");
		}
	});
}

/**
 * Save current task
 */
Yatay.Common.saveTask = function(name, code) {
	var values = escape(code);
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'save', name:name, code:values},
		success: function(content){
			//alert("success");
		},
		error:function(){
			//alert("failure");
		}
	});
}

/**
 * Long Poll for results
 */
function pollResults()
{
	setTimeout(function(){
		//If it's running (boton stop is showing) then poll
		if ($('#btn_stop').css("display").indexOf('block') != -1)
		{
			$.ajax({
				url: "/index.html",
				type: "POST",
				data: {id:'poll', name:'', code:''},
				success: function(html) {
					if (html.length > 0)
					{
						var sensor = html.split(' ')[0];
						var value = html.replace(sensor,'');
						if ($("#spnResSensor").text() != sensor || $("#spnResValue").text() != value)
							$('#divResults').show();
						$("#spnResSensor").text(sensor);
						$("#spnResValue").text(value);

					}
					else
					{
						$("#spnResSensor").text('');
						$("#spnResValue").text('');
					}
				},
				error:function() {
				},
				complete: pollResults
			});
		}
		else
		{
				$("#spnResSensor").text('');
				$("#spnResValue").text('');
		}
	},1000);
}


/**
 * Long Poll for debug
 */

function debugPoll()
{
	setTimeout(function(){
		//If it's running (boton stop is showing) then poll
		if ($('#btn_stop').css("display").indexOf('block') != -1)
		{
			$.ajax({
				url: "/index.html",
				type: "POST",
				data: {id:'pollDebug', name:'', code:''},
				success: function(html) {
					if (html.length > 0)
					{
						var blockId = parseInt(html)
						Yatay.DebugLastBlock = blockId;
						Blockly.mainWorkspace.getBlockById(blockId).select()
					}
				},
				error:function() {
				},
				complete: debugPoll
			});
		}
		else
		{
			Blockly.mainWorkspace.getBlockById(Yatay.DebugLastBlock).unselect()
		}
		
	},500);
}
