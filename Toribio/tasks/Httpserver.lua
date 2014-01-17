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
	local c =	coroutine.create(
		function ()
	        local executor = require 'tasks/Executor'
			executor.kill_tasks()
		end)
	coroutine.resume(c)
end

local function saveTask(code, name)
	local decoded_task = url_decode(url_decode(code))	
	local c =	coroutine.create(
		function ()
			local pjadmin = require 'tasks/ProjectAdmin'		
			pjadmin.save_task(name, decoded_task)
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

local function load_projs()
	local pjadmin = require 'tasks/ProjectAdmin'		
	return pjadmin.load_projs()
end

--local actions = { init=initTask, kill=killTasks, save=saveTask, poll=pop_result}

local function select_action(id, code, name)
--	local action = actions[id]
--	if action ~= nil then
--		return action(code, name)
--	end
	if (id == 'init') then 
		initTask(code)
	elseif (id == 'kill') then
		killTasks()
	elseif (id == 'poll') then
		return pop_blocking(yataySensorResults,'NewSensorResult')
	elseif (id == 'pollDebug') then
		return pop_blocking(yatayDebugResults,'NewDebugResult')
	elseif (id == 'save') then
		saveTask(code, name)
	elseif (id == 'test') then
		testRobot(code)
	elseif (id == 'loadProjs') then
		return load_projs()
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
	
	http_server.set_request_handler(
		'POST',
		'/index.html',
		function(method, path, http_params, http_header)	
			local content = select_action(http_params['id'], http_params['code'], http_params['name'])
			return 200, {['content-type']='text/html', ['content-length']=#content}, content
		end
	)
	
	local conf = {
		ip= '192.168.1.46',
		port=8080,
		ws_enable = false,
		max_age = {ico=99999, css=600, html=60},
	}
	http_server.init(conf)

	print('Server is up...')
end

return M
