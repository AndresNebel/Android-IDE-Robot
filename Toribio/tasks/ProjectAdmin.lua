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

M.load_projs = function()
--	local result = {}
--	local projs = persistence.get_projects()
--	for p in projs do
--		results[p] = persistence.get_behaviours(p)
--	end
--	return results
	return persistence.get_behaviours()
end

return M
