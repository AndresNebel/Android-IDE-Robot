local M = {}

require('LuaXml')
local toribio = require 'toribio'
local devices = toribio.devices

--TODO: update comments!
--Ejecuta en el kit robotico una funcion de un sensor con los parametros pasados

M.execute = function(sensor, func, params)
	--robado de bobot_server.lua
	local device = devices[sensor]
	local api_call=device[func];
	if not api_call then return "missing call" end								
	local ret = table.pack(pcall(api_call, unpack(params,1)))
	local ok = ret[1]
	if ok then 
		return table.concat(ret, ',', 2)
	else 
		print ("error calling", table.concat(ret, ',', 2))
	end
end

--Enlista las funciones de los sensores y actuadores que poseen un mapeo en el config.
--Si estas se encuentran disponibles en el kit robotico les asigna available en true
--param: could be 'sensor' 'actuator' 'any' 

M.list_devices_functions = function(device_type)	
	--Load devices config file
	local file = xml.load("devices.xml")
	--Parse devices file
	local devs = file:find("devices")
	local ret = {}
	for i=1, #devs do
		if (device_type == "any" or devs[i].device_type == device_type) then
			ret[i] = {}
			ret[i].name = devs[i].name
			--Is this device available in bobot?
			ret[i].available = (devices[devs[i].name] ~= nil)
			ret[i].functions = {}
			local functions = devs[i]:find("device")
			for j=1, #functions do
				ret[i].functions[j] = {}
				ret[i].functions[j].name = functions[j].name
				ret[i].functions[j].alias = functions[j].alias
				ret[i].functions[j].params = functions[j].params
				ret[i].functions[j].ret = functions[j].ret
				--Is this function available in bobot?
				ret[i].functions[j].available = (devices[devs[i].name][functions[j].name] ~= nil)
			end
		end
	end	
	return ret								
end

return M

