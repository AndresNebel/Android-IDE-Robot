local M = {}

local sched = require 'sched'
local function url_decode(s)
	return (string.gsub (string.gsub(s, "+", " "), "%%(%x%x)",
		function(str)
		return string.char(tonumber(str, 16))
		end ))
end

M.init = function(conf)	
	--Servidor WEB
	local http_server = require "../Lumen/tasks/http-server"
	
	--Levantar todo de la carpeta www en el servidor
	http_server.serve_static_content_from_ram('/', 'Lumen/tasks/http-server/www')

	print('Server running...')

	--Manejador de pedidos post
	http_server.set_request_handler(
		'POST',
		'/index.html',
		function(method, path, http_params, http_header)	
			local task = http_params['code']
			local decoded_task = url_decode(url_decode(task))
			--Inicializar tareas

			local c = coroutine.create(function ()
									local executor = require 'tasks/Executor'
									executor.create_task(decoded_task)
								 end)
			
			coroutine.resume(c)
			
			local content = ''
			return 200, {['content-type']='text/html', ['content-length']=#content}, content
		end
	)
	
	http_server.set_request_handler(
		'POST',
		'/kill/index.html',
		function(method, path, http_params, http_header)
			--Matar todas las tareas	
			local c =	coroutine.create(function ()
									local executor = require 'tasks/Executor'
									executor.kill_tasks()
								 end)
			coroutine.resume(c)					
			local content = ''
			return 200, {['content-type']='text/html', ['content-length']=#content}, content
		end
	)

	local conf = {
--		ip='127.0.0.1',
--		ip='192.168.2.24',
		ip= '192.168.1.6',
		port=8080,
		ws_enable = false,
		max_age = {ico=99999, css=600, html=60},
	}
	http_server.init(conf)
end

return M
