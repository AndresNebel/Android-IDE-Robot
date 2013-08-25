local M = {}

M.name = 'Barrera'
M.priority = 2
M.done = false --termine de ejecutar 

local behaviours = require 'catalog'.get_catalog('behaviours')
local camera = require 'catalog'.get_catalog('camera')

local toribio = require 'toribio'		
local motors = toribio.wait_for_device('bb-motors')
local sched = require 'sched'

local wantToTakeControl = function()
    if (M.priority < activeBehaviour.priority) then
        activeBehaviour = M
    end
end

local run = function ()
    local cameraValue = camera:waitfor("CameraValue")
	motors.setvel2mtr(1,600,1,620)
	sched.sleep(1.5)		
	motors.setvel2mtr(0,0,0,0)
	sched.sleep(0.9)
	if (cameraValue.data == "NoLata") then		
	    motors.setvel2mtr(1,920,0,900)
	    sched.sleep(1)		
    	motors.setvel2mtr(0,0,0,0)
	end
	M.done = true
end

M.ReleaseControl = function()
	motors.setvel2mtr(0,0,0,0)
end

M.init = function(conf)	    
    behaviours:register(M.name, M)
    M.done = false
    local waitTakeControl = {emitter='*', events={'BarreraWarning'}}
	local waitd = {emitter='*', events={M.name}}

	M.task = sched.sigrun(waitd, run)

	sched.sigrun(waitTakeControl, wantToTakeControl)

end


return M

