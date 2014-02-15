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
Yatay.Msg.DIALOG_TXT_REMOTE_INPUT = "Stored data: ";
Yatay.Msg.DIALOG_REMOTE_LOADER = "get";
Yatay.Msg.DIALOG_LOADING = "loading...";
Yatay.Msg.DIALOG_PROJECT = "Project";
Yatay.Msg.DIALOG_BEHAVIOURS = "Behaviours";
Yatay.Msg.DIALOG_NO_BEHAVIOURS = "there aren't behaviours on server. ";
Yatay.Msg.DIALOG_START = "Start";
Yatay.Msg.DIALOG_PROJMANAGER_LABEL = "Wellcome to Yatay!";
Yatay.Msg.DIALOG_NEW_PROJ = "New project";
Yatay.Msg.DIALOG_REMOTE_PROJ = "Join project";
Yatay.Msg.DIALOG_TXT_REMOTE_PROJ = "Existing projects: ";
Yatay.Msg.DIALOG_PROJ_NAME = "Name: ";
Yatay.Msg.DIALOG_NO_PROJS = "there are any left. ";
Yatay.Msg.DIALOG_DELETE_ALL = "All";
Yatay.Msg.DIALOG_DELETE_WORKSPACE = "Only workspace";
Yatay.Msg.DIALOG_DELETE_LABEL = "What you want to delete?";

// File saver Messages
Yatay.Msg.FILE_BLOCKS = "blocks";
Yatay.Msg.FILE_CODE = "code";

// SVG Behaviours popup
Yatay.Msg.SVG_BEHAVIOURS = '<svg width="128pt" height="32pt"><path fill="#5B8FA6" d=" M 17.37 7.50 C 20.56 7.07 23.79 7.34 27.00 7.30 C 62.28 7.31 97.57 7.32 132.85 7.30 C 133.23 15.87 132.89 24.45 133.03 33.03 C 103.00 33.00 72.98 32.98 42.96 33.03 C 38.77 32.67 36.46 38.03 32.17 37.03 C 29.90 36.01 28.04 34.28 25.80 33.20 C 20.97 32.72 16.10 33.29 11.26 32.82 C 11.35 27.21 11.26 21.59 11.29 15.98 C 10.94 12.15 13.94 8.74 17.37 7.50 Z" /></svg>';

//TODO: Tour Messages 
Yatay.Msg.TOUR_BLOCKS_TITLE = '¿Dónde están los bloques?';
Yatay.Msg.TOUR_BLOCKS_CONTENT = 'Aquí encontraras todos los bloques, comienza con un bloque de comportamiento!';
Yatay.Msg.TOUR_RBTEST_TITLE = '¿Qué valores dan los sensores?'; 
Yatay.Msg.TOUR_RBTEST_CONTENT = 'Puedes probar y calibrar los sensores y actuadores del robot Butiá';
Yatay.Msg.TOUR_RUN_TITLE = '¿Quieres ejecutar tus comportamientos?';
Yatay.Msg.TOUR_RUN_CONTENT = 'Comienza la ejecución de tus comportamientos, también puedes depurar!';
Yatay.Msg.TOUR_EDIT_TITLE = '¿Qué código se está generando?';
Yatay.Msg.TOUR_EDIT_CONTENT = 'Puedes editar y probar el código de tus comportamientos.';
Yatay.Msg.TOUR_BXREADY_TITLE = '¿Terminaste de armar tu comportamiento?'; 
Yatay.Msg.TOUR_BXREADY_CONTENT = 'Puedes marcarlo como listo y seguir con otro!';
Yatay.Msg.TOUR_NEXT = 'next';
Yatay.Msg.TOUR_PREV = 'previous';

// Popup Messages 
Yatay.Msg.POPUP_RESULTS_ROBOTINFO = 'Robot Info.: ';
Yatay.Msg.POPUP_RESULTS_CONSOLE = 'Console: ';

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
