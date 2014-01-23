local M = {}

local sched = require 'sched'
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
	local results = ''
	local projs = persistence.get_projects()
	for i=1, #projs do
		if (results == '') then
			results = projs[i] .. '#' .. persistence.get_behaviours(projs[i])
		else		
			results = results .. '|' .. projs[i] .. '#' .. persistence.get_behaviours(projs[i])	
		end	
	end
	return results
end

M.load_projs = function()
	local results = ''
	local projs = persistence.get_projects()
	for i=1, #projs do
		if (results == '') then
			results = projs[i]
		else 
			results = results .. ';' .. projs[i]
		end
	end
	return results
end 

return M
