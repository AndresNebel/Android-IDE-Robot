local M = {}

M.name = 'Camera'
M.priority = 4 
M.done = false --termine de ejecutar (avoid ejecuta en un paso, no es necesario)
M.Baile = false



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
    
    print("camera action: "..cameraValue.data)
    
        
        if (cameraValue.data == "Lata_GirarIzq") then
            M.Baile = false
            motors.setvel2mtr(0,140,1,140)
            sched.sleep(0.1)
        elseif (cameraValue.data == "Lata_GirarDer") then
            M.Baile = false
            motors.setvel2mtr(1,140,0,140)
            sched.sleep(0.1)
        elseif (cameraValue.data == "Lata_Lejos") then
            M.Baile = false
            motors.setvel2mtr(0,270,0,270)
            sched.sleep(0.1)
        elseif (cameraValue.data == "Lata_Cerca") then
            M.Baile = false            
            motors.setvel2mtr(0,190,0,190)
            sched.sleep(0.1)
        elseif (cameraValue.data == "Lata_MuyCerca") then
            motors.setvel2mtr(1,0,1,0)

            if (not M.Baile) then
                M.Baile = true
                --baile de la lata
                for i = 1, 8 do
                    motors.setvel2mtr(1,420,0,400)
                    sched.sleep(0.1)
                    motors.setvel2mtr(0,420,1,400)
                    sched.sleep(0.1)
                end    
                motors.setvel2mtr(1,0,1,0)
                sched.sleep(0.5)
            end
        end    

   -- end 

    
    M.done = true
end

M.ReleaseControl = function()
    motors.setvel2mtr(0,0,0,0)
end

M.init = function(conf)        
    behaviours:register(M.name, M)
    M.done = false
    local waitTakeControl = {emitter='*', events={'HayLata'}}
    local waitd = {emitter='*', events={M.name}}
    M.task = sched.sigrun(waitd, run)
    sched.sigrun(waitTakeControl, wantToTakeControl)

end


return M
