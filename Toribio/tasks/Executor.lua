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
					print('kill')
--					activeBehaviour.task:kill()
	--				previousBehaviour.task:kill()
					RBTManagerActivate = false
					for name, btable in behaviours:iterator() do
						behaviours:unregister(name)
						btable.compete_task:kill()
						btable.task:kill()
						btable = {}
						none = false
					end	
					activeBehaviour = nil
					previousBehaviour = nil
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
							if (not ok) then
								print("Yatay detecto un error al ejecutar la task:")
								print(tasktable)
							else
								--Control: tarea ya existente?
								if (not exist(tasktable.name)) then
									local newTask = sched.new_task(code)
									tasktable.init(true)
									behaviours:register(tasktable.name, tasktable)
									RBTManagerActivate = true
									print('Task '.. tasktable.name ..' initialized!')
								else
									print('Task '.. tasktable.name ..' already exist.')
								end
							end
						else
								print("Yatay detecto un error al compilar la task:")
								print(errorCompilacion)
						end
					end

M.test_robot = function(task)
						local code, errorCompilacion = loadstring(task)
						if (not errorCompilacion) then	
							local ok, tasktable = pcall(code)
							if (not ok) then
								print("Yatay detecto un error al ejecutar la task:")
								print(tasktable)
							else
								--Control: tarea ya existente?
								local newTask = sched.new_task(code)
								print('A robot test is running')							
								tasktable.run()
							end
						else
								print("Yatay detecto un error al compilar la task:")
								print(errorCompilacion)
						end
					end


return M



