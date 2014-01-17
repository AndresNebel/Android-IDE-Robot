document.write('<script type="text/javascript" src="./blocks/math.js"></script>\n');
document.write('<script type="text/javascript" src="./blocks/butia.js"></script>\n');
document.write('<script type="text/javascript" src="./blocks/control.js"></script>\n');
document.write('<script type="text/javascript" src="./blocks/variables.js"></script>\n');

if (!Yatay.Msg){ 
	Yatay.Msg = {};
}

// Menu Messages
Yatay.Msg.MENU_ROBOTEST = "Robot Test";
Yatay.Msg.MENU_DEBUG = "Debug";
Yatay.Msg.MENU_RUN = "Run";
Yatay.Msg.MENU_EDIT = "Code View";
Yatay.Msg.MENU_LOAD = "Load";
Yatay.Msg.MENU_SAVE = "Save";
Yatay.Msg.MENU_STOP = "Stop";
Yatay.Msg.MENU_CODE_LABEL = "Code Generated";
Yatay.Msg.MENU_TRASH = "Clean worksapce";

// Dialogs Messages
Yatay.Msg.DIALOG_CODE_LABEL = "Code Generated";	
Yatay.Msg.DIALOG_RUN = "Run";
Yatay.Msg.DIALOG_LOADER_LABEL = "Choose some project!";		
Yatay.Msg.DIALOG_OPEN = "Open";
Yatay.Msg.DIALOG_LOCAL_INPUT = "Local";
Yatay.Msg.DIALOG_REMOTE_INPUT = "Remote";
Yatay.Msg.DIALOG_TXT_REMOTE_INPUT = "You can get the stored behaviors on the server: ";
Yatay.Msg.DIALOG_REMOTE_LOADER = "load";
Yatay.Msg.DIALOG_LOADING = "loading...";
Yatay.Msg.DIALOG_PROJECT = "Project";
Yatay.Msg.DIALOG_BEHAVIOURS = "Behaviours";
Yatay.Msg.DIALOG_NO_BEHAVIOURS = "There aren't behaviours on server.";

// Butia Messages
Yatay.Msg.BUTIA_HELPURL = 'http://www.fing.edu.uy/inco/proyectos/butia/';
Yatay.Msg.BUTIA_MOVE_TITLE = 'move';
Yatay.Msg.BUTIA_MOVE_FORWARD = 'forward';
Yatay.Msg.BUTIA_MOVE_BACKWARD = 'backward';
Yatay.Msg.BUTIA_MOVE_TOOLTIP = 'Move forward or back robot Butiá.';
Yatay.Msg.BUTIA_TRUN_TITLE = 'turn';
Yatay.Msg.BUTIA_TURN_LEFT = 'left';
Yatay.Msg.BUTIA_TURN_RIGHT = 'right';
Yatay.Msg.BUTIA_TURN_TOOLTIP = 'Trun left or right robot Butiá.';
Yatay.Msg.BUTIA_STOP_TITLE = 'stop';
Yatay.Msg.BUTIA_STOP_TOOLTIP = 'Stop robot Butiá.';
Yatay.Msg.BUTIA_GREY_TITLE = 'grey sensor';
Yatay.Msg.BUTIA_GREY_TOOLTIP = 'Get value of grey sensor of robot Butiá.';