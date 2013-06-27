local sched = require 'sched'
local selector = require "tasks/selector"
local M = {}

local camera = require 'catalog'.get_catalog('camera')

M.init = function(conf)

    local CameraValue = {}
    CameraValue.data = "NoLata"
    camera:register("CameraValue", CameraValue) 

    conf = conf or  {}
	local ip = conf.ip or '*'
	local port = conf.port or 2113
		
	local tcp_server = selector.new_tcp_server(ip, port, 'line')
	sched.run( function()
		local waitd_accept={emitter=selector.task, events={tcp_server.events.accepted}}

		M.task = sched.sigrun(waitd_accept, function (_,_, sktd_cli)
			if sktd_cli then
				
				local waitd_skt = {emitter=selector.task, events={sktd_cli.events.data}}
				sched.sigrun(waitd_skt, function(_,  _, data, err )
					if not data then 
						return nil, err 
					end
					CameraValue.data = data
					print(CameraValue.data)
				end, true)
			end
		end)
	end)
	
end

return M
