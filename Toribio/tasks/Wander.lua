local M = {}

M.name = 'Wander'
M.priority = 10
M.done = false

local behaviours = require 'catalog'.get_catalog('behaviours')

local toribio = require 'toribio'	
local sched = require 'sched'	
local motors = toribio.wait_for_device('bb-motors')

local run = function ()
    M.done = true
	if firstTime then
		print("Wander First Time\n")
        firstTime = false
        --motors.setvel2mtr(1,720,0,700)
    	--sched.sleep(8.4)        
    end
	while true do    
		print("Wander pa adelante\n")    
		motors.setvel2mtr(0,300,0,300)
		sched.sleep(2.4)
	end
end

M.ReleaseControl = function()
	motors.setvel2mtr(0,0,0,0)
end

M.init = function(conf)	
    behaviours:register(M.name, M)
    M.done = false
    local waitd = {emitter='*', events={M.name}}    
       
    M.task = sched.sigrun(waitd, run)
end

return M

