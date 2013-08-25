local M = {}



M.init = function(conf)
	local sched = require 'sched'

	return sched.run(function()
		local toribio = require 'toribio'
		local isRunning = false
		local lastVal = 0
		activeBehaviour = nil
		
		local button = toribio.wait_for_device('bb-button:2')
		local motors = toribio.wait_for_device('bb-motors')
		local distanc = toribio.wait_for_device('bb-distanc:5')
		local grey1 = toribio.wait_for_device('bb-grey:1')
		local grey2 = toribio.wait_for_device('bb-grey:6')
		local barrera = toribio.wait_for_device('bb-volt:4')

        local behaviours = require 'catalog'.get_catalog('behaviours')
        local camera = require 'catalog'.get_catalog('camera')
        
        local defaultBehaviour = behaviours:waitfor('Wander') 
        local cameraValue = camera:waitfor("CameraValue")

		while true do

			if button.getValue() == 1 and lastVal == 0 then
				isRunning = not isRunning
                firstTime = true
			end
			lastVal = button.getValue()

			if isRunning then
			    local done = false
			    if activeBehaviour then
                    done = activeBehaviour.done
                end
                
				previousBehaviour = activeBehaviour
				--Si la tarea anterior aun no termino, la dejo
				if activeBehaviour == nil or activeBehaviour.done then
					activeBehaviour = defaultBehaviour
    			end  
    			                 
				--Programa principal--


				--Leer distancia
                if (distanc.getValue() > 20000) then
                    sched.signal('ProximityWarning')
                    sched.sleep(0.1)
                end
				
				--Leer barrera
                if (barrera.getValue() > 0) then
                    sched.signal('BarreraWarning')
                    sched.sleep(0.1)
                end
				
				--Preguntar si ultimo valor del buffer de la camara es hay lata
                if (cameraValue.data ~= "NoLata") then
                    sched.signal('HayLata')
                    sched.sleep(0.1)
                end
                

				--Leer sensor de grises
				if (grey1.getValue() > 18000 or grey2.getValue() > 18000) then
					sched.signal('LimitWarning')
					sched.sleep(0.1)
				end							

				--Swap behaviour viejo con nuevo
				if (previousBehaviour ~= activeBehaviour) then
					if (previousBehaviour ~= nil) then
						previousBehaviour.ReleaseControl()
                        if (previousBehaviour.task ~= nil) then
    						previousBehaviour.task:kill()
                        end
                        previousBehaviour.init() --Seteo init para que en el futuro siga respondiendo a signals
					end
					
					sched.signal(activeBehaviour.name)  --Cada task tiene un signal unico con su nombre. Despertar la task activa.
					sched.sleep(0.1)
				
				end
				
				if done then 
				    sched.signal(activeBehaviour.name)  --Cada task tiene un signal unico con su nombre. Despertar la task activa.
					sched.sleep(0.1)
				end
			else
				--Ya no esta corriendo
				motors.setvel2mtr(1,0,1,0)
                if (activeBehaviour ~= nil) then
                    activeBehaviour.ReleaseControl()
                    activeBehaviour.task:kill()
                    activeBehaviour.init()
                end
                previousBehaviour = nil
				activeBehaviour = nil				
			end

            sched.sleep(0.2)
		end

	end)
end

return M

