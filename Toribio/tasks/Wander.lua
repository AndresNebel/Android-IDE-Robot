local M = {}

M.name = 'Wander'
M.priority = 10
M.done = true

local behaviours = require 'catalog'.get_catalog('behaviours')

local toribio = require 'toribio'	
local sched = require 'sched'	
local motors = toribio.wait_for_device('bb-motors')

local run = function ()
	if firstTime then
        firstTime = false
        motors.setvel2mtr(1,720,0,700)
    	sched.sleep(8.4)        
    end
	while true do        
		motors.setvel2mtr(0,700,0,700)
		sched.sleep(0.5)
	end
end

M.ReleaseControl = function()
	motors.setvel2mtr(0,0,0,0)
end

M.init = function(conf)	
    behaviours:register(M.name, M)
    
    local waitd = {emitter='*', events={M.name}}    
       
    M.task = sched.sigrun(waitd, run)
end

return M

