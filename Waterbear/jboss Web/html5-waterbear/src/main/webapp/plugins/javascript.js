/*
 *    JAVASCRIPT PLUGIN
 *
 *    Support for writing Javascript using Waterbear
 *
 */

(function(){


// Pre-load dependencies
yepnope({
    load: [ 'plugins/javascript.css',
            'lib/beautify.js',
            'lib/highlight.js',
            'lib/highlight-javascript.js',
            'lib/highlight-github.css'
    ]
});

// Add some utilities
jQuery.fn.extend({
    prettyScript: function(){
        return js_beautify(this.map(function(){
            return $(this).extract_script();
        }).get().join(''));
    },
    writeScript: function(view){
      view.html('<pre class="language-javascript">' + this.prettyScript() + '</pre>');
      hljs.highlightBlock(view.children()[0]);
    }
});

// End UI section

// expose these globally so the Block/Label methods can find them
window.choiceLists = {
    keys: 'abcdefghijklmnopqrstuvwxyz0123456789*+-./'
        .split('').concat(['up', 'down', 'left', 'right',
        'backspace', 'tab', 'return', 'shift', 'ctrl', 'alt',
        'pause', 'capslock', 'esc', 'space', 'pageup', 'pagedown',
        'end', 'home', 'insert', 'del', 'numlock', 'scroll', 'meta']),
    blocktypes: ['step', 'expression', 'context', 'eventhandler'],
    types: ['string', 'number', 'boolean', 'array', 'object', 'function', 'any'],
    rettypes: ['none', 'string', 'number', 'boolean', 'array', 'object', 'function', 'any']
};

// Hints for building blocks
//
//
// Expression blocks can nest, so don't end their scripts with semi-colons (i.e., if there is a "type" specified).
//
//

// MENUS

// Special menus used at runtime


// Temporarily disable these until I can get time to implement them properly
// wb.menu('Recent Blocks', []);
// wb.menu('Favourite Blocks', []);

// Javascript core blocks

wb.menu('Control', [
    {
        blocktype: 'eventhandler',
        id: '1cf8132a-4996-47db-b482-4e336200e3ca',
        label: 'Empezar!',
        script: 'Comportamiento {[[1]]}',
        help: 'Nueva Tarea'
    },
	{
        blocktype: 'context',
        id: '20ba3e08-74c0-428e-b612-53545de63ce0',
        label: 'Si [boolean] entonces',
        script: 'if({{1}}){[[1]]}',
        help: 'run the following blocks only if the condition is true'
    },
    {
        blocktype: 'context',
        id: '6dddaf61-caf0-4976-a3f1-9d9c3bbbf5a4',
        label: 'Si no [boolean] entonces',
        script: 'if( ! {{1}} ){ [[1]]} }',
        help: 'run the  blocks if the condition is not true'
    },
    {
        blocktype: 'step',
        id: '48bb8639-0092-4384-b5a0-3a772699dea9',
        label: 'Comentario: [string]',
        script: '// {{1}};\n',
        help: 'this is a comment and will not be run by the program'
    }    
], false);

wb.menu('Repeticiones', [
    {
        blocktype: 'context',
        id: 'aa146082-9a9c-4ae7-a409-a89e84dc113a',
        label: 'Repetir [number:10]',
        script: 'Repeat ({{1}}) times{[[1]]}',
        help: 'repeat the contained blocks so many times'       
    },
	{
        blocktype: 'context',
        id: '5a09e58a-4f45-4fa8-af98-84de735d0fc8',
        label: 'repetir hasta [boolean]',
        script: 'while(!({{1}})){[[1]]}',
        help: 'repeat forever until condition is true'
    }
]);

wb.menu('Variables', [
    {
        blocktype: 'step',
        id: '8a95bbaf-a881-4771-973e-5c29582eb32c',
        label: 'Letras: [string]',
        script: 'local.string## = {{1}};',
        returns: {
            blocktype: 'expression',
            label: 'string##',
            script: 'local.string##',
            type: 'string'
        },
        help: 'create a reference to re-use the string'
    },
    {
        blocktype: 'step',
        id: 'd10b5b49-5273-4e5b-b433-ccaf0e29914c',
        label: 'Numero: [number]',
        script: 'local.number## = {{1}};',
        returns: {
            blocktype: 'expression',
            label: 'number##',
            script: 'local.number##',
            type: 'number'
        },
        help: 'create a reference to re-use the number'
    }
]);
// wb.menu('User Defined', [
//     {
//         blocktype: 'context',
//         id: '180ec0db-5723-4e74-8740-3488cfa9aa8e',
//         labels: [
//             'New [choice:blocktypes] with arguments:',
//             'And body returning [any]'
//         ],
//         script: 'var block## = newBlockHandler([{{1}}],[{{2}}])',
//         help: 'Create a new block for re-use',
//         returns: 'block'
//     },
//     {
//         blocktype: 'context',
//         id: '3f44e23a-66f7-4acf-9b1a-1e498e842c06',
//         label: 'New [choice:blocktypes] with arg1 [choice:types]',
//         script: 'alert("implement me");',
//         help: 'Create a new block for re-use'
//     },
//     {
//         blocktype: 'context',
//         id: '870c6588-3a0b-4073-89c2-4726c3544658',
//         label: 'New [choice:blocktypes] with arg1 [choice:types] returns [choice:rettypes]',
//         script: '',
//         help: ''
//     }
// ]);

wb.menu('Butia', [
     {
        blocktype: 'step',
        id: '66b33236-c9ce-4b6c-9b69-e8c4fdadbf52',
        label: 'Esperar [number:1] segs',
        script: 'setTimeout(function(){[[1]]},1000*{{1}});',
        help: 'pause before running the following blocks'
    },
	{
        blocktype: 'step',
        id: '66b33236-c9ce-4b6c-9b69-e8c4fdadbf52',
        label: 'Velocidad motores: [number:1] ',
        script: 'CALL motors setvel2mtr 1 {{1}} 1 {{1}}',
        help: 'Mover al Robot Butia a una velocidad ingresada'
    }
	
], false);


wb.menu('Operadores', [
    {
        blocktype: 'expression',
        id: '406d4e12-7dbd-4f94-9b0e-e2a66d960b3c',
        label: '[number:0] + [number:0]',
        type: 'number',
        script: "({{1}} + {{2}})",
        help: 'sum of the two operands'
    },
    {
        blocktype: 'expression',
        id: 'd7082309-9f02-4cf9-bcd5-d0cac243bff9',
        label: '[number:0] - [number:0]',
        type: 'number',
        script: "({{1}} - {{2}})",
        help: 'difference of the two operands'
    },
    {
        blocktype: 'expression',
        id: 'bd3879e6-e440-49cb-b10b-52d744846341',
        label: '[number:0] * [number:0]',
        type: 'number',
        script: "({{1}} * {{2}})",
        help: 'product of the two operands'
    },
    {
        blocktype: 'expression',
        id: '7f51bf70-a48d-4fda-ab61-442a0766abc4',
        label: '[number:0] / [number:0]',
        type: 'number',
        script: "({{1}} / {{2}})",
        help: 'quotient of the two operands'
    }
       
]);
wb.menu('Condicionales', [
	
   {
        blocktype: 'expression',
        id: 'd753757b-a7d4-4d84-99f1-cb9b8c7e62da',
        label: '[number:0] < [number:0]',
        type: 'boolean',
        script: "({{1}} < {{2}})",
        help: 'first operand is less than second operand'
    },
    {
        blocktype: 'expression',
        id: 'e3a5ea20-3ca9-42cf-ac02-77ff06836a7e',
        label: '[number:0] = [number:0]',
        type: 'boolean',
        script: "({{1}} === {{2}})",
        help: 'two operands are equal'
    },
    {
        blocktype: 'expression',
        id: '5a1f5f68-d74b-4154-b376-6a0200f585ed',
        label: '[number:0] > [number:0]',
        type: 'boolean',
        script: "({{1}} > {{2}})",
        help: 'first operand is greater than second operand'
    },
    {
        blocktype: 'expression',
        id: '770756e8-3a10-4993-b02e-3d1333c98958',
        label: '[boolean] and [boolean]',
        type: 'boolean',
        script: "({{1}} && {{2}})",
        help: 'both operands are true'
    },
    {
        blocktype: 'expression',
        id: 'a56c0d03-5c5c-4459-9aaf-cbbea6eb3abf',
        label: '[boolean] or [boolean]',
        type: 'boolean',
        script: "({{1}} || {{2}})",
        help: 'either or both operands are true'
    },
    {
        blocktype: 'expression',
        id: '138a6840-37cc-4e2d-b44a-af32e673ba56',
        label: 'not [boolean]',
        type: 'boolean',
        script: "(! {{1}})",
        help: 'operand is false'
    }   
   
], false);

$('.scripts_workspace').trigger('init');

$('.socket input').live('click',function(){
    $(this).focus();
    $(this).select();
});

})();
