local M = {}

local sched = require 'sched'
local executor = require 'tasks/Executor'

local function url_decode(s)
	return (string.gsub (string.gsub(s, "+", " "), "%%(%x%x)",
		function(str)
		return string.char(tonumber(str, 16))
		end ))
end

local function initTask(code)
	local decoded_task = url_decode(url_decode(code))		
		local c = coroutine.create(
		function ()
				local executor = require 'tasks/Executor'
			executor.create_task(decoded_task)
 		end)
	coroutine.resume(c)
end

local function testRobot(code)
	local decoded_task = url_decode(url_decode(code))		
		local c = coroutine.create(
		function ()
			local executor = require 'tasks/Executor'
			executor.test_robot(decoded_task)
 		end)
	coroutine.resume(c)
end

local function killTasks()
	yataySensorResults = nil
	yatayDebugResults = nil
	yatayWebConsole = ''
	local c =	coroutine.create(
		function ()
			local executor = require 'tasks/Executor'
			executor.kill_tasks()
		end)
	coroutine.resume(c)
end

local function saveTask(project, block, code)
	local decoded_task = url_decode(url_decode(code))  
	local c =  coroutine.create(
		function ()
			local pjadmin = require 'tasks/ProjectAdmin'    
			pjadmin.save_task(project, block, decoded_task)
		end)
	coroutine.resume(c)
end

local function pop_blocking(name, ev_name)
--	print('Results:', ev_name, name)
	if (name ~= nil) then
		return name
	end
	local _, event = sched.wait({
		emitter='*', 
		timeout=2, 
		events={ev_name}
	})
--	print('Aw Results:', ev_name, name)
	if (name ~= nil) then
		return name
	end
	return "";
end 

local function load_bxs()
	local pjadmin = require 'tasks/ProjectAdmin'		
	return pjadmin.load_bxs()
end

local function load_projs()
	local pjadmin = require 'tasks/ProjectAdmin'		
	return pjadmin.load_projs()
end

local function refresh()
	local robotIface = require 'tasks/RobotInterface'
	if (robotIface.refresh_devices()) then
		return 'yes'
	else 
		return 'no'
	end
end


local function saveTempLocal(xml, filename)
	local decoded_xml = url_decode(url_decode(xml))	
	local decoded_filename = url_decode(url_decode(filename))	
	file, errors = io.open('Lumen/tasks/http-server/www/apps/yatay/_downloads/'..decoded_filename..'.apk', 'w+')	
	if (errors == nil) then
		file:write(decoded_xml)
		file:close()
	end
	return "";
end

local function select_action(id, project, block, code)
	if (id == 'init') then 
		initTask(code)
	elseif (id == 'kill') then
		killTasks()
	elseif (id == 'poll') then
		local ret = pop_blocking(yataySensorResults, 'NewSensorResult').."#;#"..yatayWebConsole
		return ret
	elseif (id == 'pollDebug') then
		return pop_blocking(yatayDebugResults, 'NewDebugResult')		 
	elseif (id == 'save') then
		saveTask(project, block, code)
	elseif (id == 'test') then
		testRobot(code)
	elseif (id == 'loadBxs') then
		return load_bxs()
	elseif (id == 'loadProjs') then
		return load_projs()
	elseif (id == 'blocks') then	
		return pop_blocking(yatayBlocksRefresh, 'BlocksRefresh')
	elseif (id == 'refreshBlocks') then
		return refresh()
	elseif (id == 'saveTempLocal') then
		return saveTempLocal(code,name)		
	end
	return ""
end

M.init = function(conf)	
	--Servidor WEB
	local http_server = require "../Lumen/tasks/http-server"	
	
	--Levantar todo de la carpeta www en el servidor
	http_server.serve_static_content_from_ram('/', 'Lumen/tasks/http-server/www')

	--Inicializando la cola de resultados
	--TODO: hacer una tabla de resultados
	yataySensorResults = nil
	yatayDebugResults = nil	
	yatayBlocksRefresh = ''	
	yatayWebConsole = ''

	http_server.set_request_handler(
		'POST',
		'/index.html',
		function(method, path, http_params, http_header)	
			local content = select_action(http_params['id'], http_params['project'], http_params['block'], http_params['code'])
			return 200, {['content-type']='text/html', ['content-length']=#content}, content
		end
	)
	
	local conf = {
		ip= '192.168.1.47',
		port=8080,
		ws_enable = false,
		max_age = {ico=99999, css=600, html=60},
	}
	http_server.init(conf)

	print('Server is up...')
end

return M
