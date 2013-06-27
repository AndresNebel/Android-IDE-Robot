local M = {}

M.name = 'Avoid'
M.priority = 2
M.done = true --termine de ejecutar (avoid ejecuta en un paso, no es necesario)

local behaviours = require 'catalog'.get_catalog('behaviours')

local toribio = require 'toribio'		
local motors = toribio.wait_for_device('bb-motors')
local sched = require 'sched'

local wantToTakeControl = function()
        print('takeControl')
    if (M.priority < activeBehaviour.priority) then
        activeBehaviour = M
    end
end

local run = function ()
	motors.setvel2mtr(1,720,0,700)
	sched.sleep(2.1)		
end

M.ReleaseControl = function()
	motors.setvel2mtr(0,0,0,0)
end

M.init = function(conf)	    
    behaviours:register(M.name, M)
    local waitTakeControl = {emitter='*', events={'ProximityWarning'}}
	local waitd = {emitter='*', events={M.name}}

	M.task = sched.sigrun(waitd, run)

	sched.sigrun(waitTakeControl, wantToTakeControl)

end


return M

