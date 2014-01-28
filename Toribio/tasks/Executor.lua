local M = {}
-- the true parameter makes the catalog strong, thus avoiding garbage collection
local behaviours = require 'catalog'.get_catalog('behaviours', true)
local sched = require 'sched'
M.tests_id = 1

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
					collectgarbage('restart')
					--Autogen Id for robot calibrations
					M.tests_id = 1
					RBTManagerActivate = false
					for name, btable in behaviours:iterator() do
						behaviours:unregister(name)
						if (btable.compete_task ~= nil) then
							btable.compete_task:kill()
						end
						if (btable.task ~= nil) then
							btable.task:kill()
						end
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
								--Control: tasks already exists?
								if (not exist(tasktable.name)) then
									collectgarbage('stop');
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
								if (not exist(M.tests_id)) then
									collectgarbage('stop');
									for name, btable in behaviours:iterator() do
										print('before',name)
									end
									behaviours:register(M.tests_id, tasktable)
									print(behaviours)
									for name, btable in behaviours:iterator() do
										print(name)
									end
									local newTask = sched.new_task(code)
									tasktable.init(true)
									print('A robot test is running')							
								else
									print('Task '.. M.tests_id ..' already exist.')
								end
						end
						else
								print("Yatay detecto un error al compilar la task:")
								print(errorCompilacion)
						end
					end


return M



