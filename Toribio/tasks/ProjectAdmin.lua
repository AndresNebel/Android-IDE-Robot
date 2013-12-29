local M = {}

local sched = require 'sched'
local persistence = require 'tasks/Persistence'

M.save_task = function(name, task)
	if (name ~= nil and task ~= nil) then		
		if (persistence.exist(name)) then
			persistence.update(name, task)
		else
			persistence.insert(name, task)
		end
	end
end

return M
