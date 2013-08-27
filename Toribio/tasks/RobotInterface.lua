local M = {}
require('LuaXml')
local toribio = require 'toribio'
local devices = toribio.devices

--Ejecuta en el kit robotico una funcion de un sensor con los parametros pasados
M.Execute = function(sensor, func, params)
			end


--Enlista las funciones de los sensores y actuadores que poseen un mapeo en el config.
--Si estas se encuentran disponibles en el kit robotico les asigna available en true
M.ListSensorActuatorFunctions = function()
									local file = xml.load("devices.xml")
									local sensores = file:find("devices")
									local ret = {}

									for i=1, #sensores do

										ret[i].alias = sensores[i].alias
										--Esta en la lista de devices de bobot?
										ret[i].available = (devices[sensores[i].name] ~= nil)
										ret[i].functions = {}

										local functions = dev[i]:find("sensor")
										for j=1, #functions do

											ret[i].functions[j].alias = functions[j].alias
											ret[i].functions[j].params = functions[j].params
											ret[i].functions[j].ret = functions[j].ret
											--Esta en la lista de funciones del sensor en bobot?
											ret[i].functions[j].available = (devices[sensores[i].name][functions[j].name] ~= nil)

										end
									end	
									return ret								
								end

