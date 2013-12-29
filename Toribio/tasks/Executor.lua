local M = {}

local behaviours = require 'catalog'.get_catalog('behaviours')
local sched = require 'sched'

local function exist(task)
	for name in behaviours:iterator() do
		if name == task then
			return true	
		end				
	end
	return false
end 

M.kill_tasks = function()
	local none = true
	for name, task in behaviours:iterator() do
		print('Killing '..name)
		behaviours:unregister(name)
		task:kill()
		none = false
	end	
	if (none) then 
		print('No tasks to kill.')
	else
		print('All task killed!')
	end 
 end


M.create_task = function(task)
	local code, errorCompilacion = loadstring(task)
	if (not errorCompilacion) then	
		local ok, tasktable = pcall(code)
		--Control: tarea ya existente?
		if (not exist(tasktable.name)) then
			local newTask = sched.new_task(code)
			behaviours:register(tasktable.name, newTask)	
			print('Task '.. tasktable.name ..' initialized!')
		else
			print('Task '.. tasktable.name ..' already exist.')
		end
	end
 end
 
return M