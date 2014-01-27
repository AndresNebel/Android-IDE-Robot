local M = {}

local sched = require 'sched'
local json = require 'json'
local persistence = require 'tasks/Persistence'

M.save_task = function(project, block, code)
	if (project ~= nil and block ~= nil and code ~= nil) then		
		if (persistence.exist(project, block)) then
			persistence.update(project, block, code)
		else
			persistence.insert(project, block, code)
		end
	end
end

M.load_bxs = function()
	local result = {}
	local projs = persistence.get_projects()
	for i=1, #projs do
		result[i] = {}
		result[i].project = projs[i] 
		result[i].behaviours = persistence.get_behaviours(projs[i])
	end
	return json.encode(result)
end

M.load_projs = function()
	local projs = persistence.get_projects()
	return json.encode(projs)
end 

return M
