local M = {}

local sched = require 'sched'
local behaviours = require 'catalog'.get_catalog('behaviours')

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
			local kill = http_params['kill']

			if kill then
				local taskToKill = behaviours:waitfor(M.taskname)	
				taskToKill:kill()
				print('Task killed!')

			else
				local code, errorCompilacion = loadstring(url_decode(url_decode(task)))
				--print('Compilation state:', code, errorCompilacion)
				if (not errorCompilacion) then
					local ok, tasktable = pcall(code)	
					local newTask = sched.new_task(code)
					behaviours:register(tasktable.name, newTask)					
					M.taskname = tasktable.name
					--tasktable.init()
				end
				print('Task initialized!')
			end

			local content = ''
			return 200, {['content-type']='text/html', ['content-length']=#content}, content
		end
	)
	
	local conf = {
		ip='127.0.0.1', 
		port=8080,
		ws_enable = false,
		max_age = {ico=5, css=60},
	}
	http_server.init(conf)
end

return M
