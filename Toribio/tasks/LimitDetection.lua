local M = {}

M.name = 'LimitDetection'
M.priority = 1
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
    local grey1 = toribio.wait_for_device('bb-grey:1')
	local grey2 = toribio.wait_for_device('bb-grey:6')
	local val1 = grey1.getValue()
    local val2 = grey2.getValue()
    
    motors.setvel2mtr(1,900,1,900)
	sched.sleep(0.3)	
	
	if (val1 > 18000 and val2 > 18000) then
	    motors.setvel2mtr(1,900,0,900)
	    sched.sleep(2)		
    elseif (val1 > 18000) then
   	    motors.setvel2mtr(0,900,1,900)
	    sched.sleep(1.3)		
    elseif (val2 > 18000) then
        motors.setvel2mtr(1,900,0,900)
	    sched.sleep(1.3)		
    end
    motors.setvel2mtr(0,0,0,0)
	M.done = true
end

M.ReleaseControl = function()
	motors.setvel2mtr(0,0,0,0)
end

M.init = function(conf)	    
    M.done = false
    behaviours:register(M.name, M)
    local waitTakeControl = {emitter='*', events={'LimitWarning'}}
	local waitd = {emitter='*', events={M.name}}

	M.task = sched.sigrun(waitd, run)

	sched.sigrun(waitTakeControl, wantToTakeControl)

end


return M

