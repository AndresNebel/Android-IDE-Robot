local M = {}

M.name = 'Camera'
M.priority = 3
M.done = true --termine de ejecutar (avoid ejecuta en un paso, no es necesario)

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
	print(cameraValue.data)
end

M.ReleaseControl = function()
	motors.setvel2mtr(0,0,0,0)
end

M.init = function(conf)	    
    print("C1")
    behaviours:register(M.name, M)
        print("C2.1")
    local waitTakeControl = {emitter='*', events={'HayLata'}}
            print("C2.2")
	local waitd = {emitter='*', events={M.name}}
        print("C3")
	M.task = sched.sigrun(waitd, run)
	sched.sigrun(waitTakeControl, wantToTakeControl)
	    print("C4")

end


return M
