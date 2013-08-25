local M = {}

M.name = 'Avoid'
M.priority = 3
M.done = false --termine de ejecutar 

local behaviours = require 'catalog'.get_catalog('behaviours')

local toribio = require 'toribio'		
local motors = toribio.wait_for_device('bb-motors')
local sched = require 'sched'

local wantToTakeControl = function()
    if (M.priority < activeBehaviour.priority) then
        activeBehaviour = M
    end
end

local run = function ()
    print('Avoiding\n')
	motors.setvel2mtr(1,920,0,900)
	sched.sleep(1)		
	motors.setvel2mtr(0,0,0,0)
	M.done = true
end

M.ReleaseControl = function()
	motors.setvel2mtr(0,0,0,0)
end

M.init = function(conf)	    
    behaviours:register(M.name, M)
    M.done = false
    local waitTakeControl = {emitter='*', events={'ProximityWarning'}}
	local waitd = {emitter='*', events={M.name}}

	M.task = sched.sigrun(waitd, run)

	sched.sigrun(waitTakeControl, wantToTakeControl)

end


return M

