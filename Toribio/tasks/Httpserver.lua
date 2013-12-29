local M = {}

local sched = require 'sched'

local function url_decode(s)
	return (string.gsub (string.gsub(s, "+", " "), "%%(%x%x)",
		function(str)
		return string.char(tonumber(str, 16))
		end ))
end

local function initTask(code, ...)
	local decoded_task = url_decode(url_decode(code))		
	local c = coroutine.create(
		function ()
			local executor = require 'tasks/Executor'
			executor.create_task(decoded_task)
 		end)
	coroutine.resume(c)
end

local function killTasks(...)
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

local actions = { init=initTask, kill=killTasks, save=saveTask }

local function select_action(id, code, name)
	action = actions[id]
	if action ~= nil then
		action(code, name)
	end
end

M.init = function(conf)	
	local http_server = require "../Lumen/tasks/http-server"	
	http_server.serve_static_content_from_ram('/', 'Lumen/tasks/http-server/www')

	print('Server running...')

	http_server.set_request_handler(
		'POST',
		'/index.html',
		function(method, path, http_params, http_header)	
			select_action(http_params['id'], http_params['code'], http_params['name'])					
			local content = ''
			return 200, {['content-type']='text/html', ['content-length']=#content}, content
		end
	)
	
	local conf = {
		ip= 'localhost',
		port=8080,
		ws_enable = false,
		max_age = {ico=99999, css=600, html=60},
	}
	http_server.init(conf)
end

return M