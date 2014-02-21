local M = {}

require 'LuaXml'
local toribio = require 'toribio'
local devices = toribio.devices
local sched = require 'sched'
local json = require 'json'

--Path to files
local butia_blocks = 'Lumen/tasks/http-server/www/apps/yatay/blocks/butia.js'
local butia_code = 'Lumen/tasks/http-server/www/apps/yatay/generators/lua/butia.js'

--Active devices at the moment
M.active_devices = nil

M.deliverResultToWebServer = function(sensorResult, userId)
	yataySensorResults[userId] = sensorResult
	sched.signal('NewSensorResult')
end

M.printToWebConsole = function(msg)
	yatayWebConsole = msg
	sched.signal('NewSensorResult')
end

--Utils
local function compare(t1, t2)
	if t1 == t2 then return true end
	if type(t1) ~= "table" or type(t2) ~= "table" then return false end
	local v2
	for k,v1 in pairs(t1) do
		v2 = t2[k]
	  	if v1 ~= v2 and not compare(v1, t2[k]) then return false end
	end
	for k in pairs(t2) do
	  	if t1[k] == nil then return false end
	end
	return true
end

--Take it from Bobot Server
M.execute = function(sensor, func, params, caller)
	local device = devices[sensor]
	if (device) then
		local api_call=device[func];

		if not api_call then
			print("Missing call")
	 		return "missing call" end	

		local is_open = device["dev"].handler or device["dev"].name =='pnp'
		if not is_open then 
			device["dev"]:open(1, 1)
		end

		local ret = table.pack(pcall(api_call, unpack(params,1)))
		local ok = ret[1]
		if ok then 
			local sensorResult = table.concat(ret, ',', 2)
			if (#sensorResult > 0) then
				M.deliverResultToWebServer(sensor..': '..sensorResult, caller)
			end
			return tonumber(sensorResult)
		else 
			print ("Error calling", table.concat(ret, ',', 2))
		end
	end
end

M.stopActuators = function()
	M.execute('bb-motors','setvel2mtr', {0,0,0,0}, -1)
end

local function parse_bobot(file, devs)
	local ret = {}
	--Check disabled devices
	local skip_dev = {}
	for sdev in devs.except:gmatch('[%w|%-|:]+') do
		skip_dev[sdev] = true
	end
	--Check disabled functions
	local skip_func = {}
	for i=1, #devs do
		if (devs[i].device_type == 'generic') then
			local functions = devs[i]:find("device")
			for j=1, #functions do
				if (functions[j].disabled == 'yes') then
					skip_func[functions[j].name] = true					
				end
			end			
		end
	end	
	local i = 1
	for name, _ in pairs(devices) do	
		--Is this device enable?
		if not skip_dev[name] then		
			ret[i] = {}
			ret[i].name = name
			ret[i].port = 0	
			ret[i].available = true
			ret[i].functions = {}
			local device = devices[name]
			local skip_fields = {remove=true,name=true,register_callback=true,events=true,task=true,filename=true,module=true,bobot_metadata=true}
			local j = 1
			for fname, fdef in pairs(device) do
				--Is this function enable?
				if not (skip_fields[fname] or skip_func[fname]) then 
					ret[i].functions[j] = {}
					ret[i].functions[j].name = fname
					ret[i].functions[j].alias = name .. '.' .. fname
					local bobot_metadata = ((device.bobot_metadata or {})[fdef] or {parameters={}, returns={}})
					local meta_parameters = bobot_metadata.parameters
					local params = 0
					for i, pars in ipairs(meta_parameters) do
						params = params + 1
					end
					ret[i].functions[j].tooltip = ''
					ret[i].functions[j].params = params
					ret[i].functions[j].values = ''
					local meta_returns = bobot_metadata.returns
					local returns = 0
					for i,rets in ipairs(meta_returns) do
						returns = returns + 1
					end
					if (returns > 0) then
						ret[i].device_type = 'sensor'
					else 
						ret[i].device_type = 'actuator'
					end
					ret[i].functions[j].ret = returns
					ret[i].functions[j].available = true
					j = j + 1
				end
			end	
			i = i + 1
		end
	end
	return ret
end

local function parse_xml(device_type, file, devs)
	local ret = {}
	--Parsing robotic-kit.xml file
	for i=1, #devs do
		if ((device_type == 'any' or devs[i].device_type == device_type) and devs[i].device_type ~= 'generic') then
			ret[i] = {}
			ret[i].name = devs[i].name
			ret[i].port = devs[i].name:match('%d+')
			ret[i].device_type = devs[i].device_type
			--Is this device available in bobot?
			ret[i].available = (devices[devs[i].name] ~= nil)
			ret[i].functions = {}
			local functions = devs[i]:find("device")
			for j=1, #functions do
				ret[i].functions[j] = {}
				ret[i].functions[j].name = functions[j].name
				ret[i].functions[j].alias = functions[j].alias
				ret[i].functions[j].tooltip = functions[j].tooltip
				ret[i].functions[j].params = functions[j].params
				ret[i].functions[j].values = functions[j].values
				ret[i].functions[j].ret = functions[j].ret
				--Is this function available in bobot?
				if (ret[i].available) then
					ret[i].functions[j].available = (devices[devs[i].name][functions[j].name] ~= nil)
				else 
					ret[i].functions[j].available = false
				end
			end			
		end
	end	
	return ret
end

M.list_devices_functions = function(device_type)	
	local file = xml.load('robotic-kit.xml')
	local devs = file:find('devices')

	local xml_devices = parse_xml(device_type, file, devs)

	if (devs.all == 'yes') then
		local bobot_devices = parse_bobot(device_type, file, devs)
		for i=1, #xml_devices do
			for j=1, #bobot_devices do
				if (xml_devices[i].name == bobot_devices[j].name) then
					for k=1, #xml_devices[i].functions do
						for l=1, #bobot_devices[j].functions do
							if (xml_devices[i].functions[k].name == bobot_devices[j].functions[l].name) then
								bobot_devices[j].functions[l].alias = xml_devices[i].functions[k].alias
								bobot_devices[j].port = xml_devices[i].port
							end
						end
					end
				end			
			end
		end
		return bobot_devices
	else
		return xml_devices
	end
end

M.put_debug_result = function(blockId, userId)
	yatayDebugResults[userId] = activeBehaviour.name..':'..activeBehaviour.blockId..':'..blockId
	sched.signal('NewDebugResult')
	sched.sleep(0.7)
end

local function write_blocks(dev, func, first)
	--Generating scripts for active blocks
	local file, errors
	local code = ''

	if (first) then
		file, errors = io.open(butia_blocks, 'w+')	
	else
		file, errors = io.open(butia_blocks, 'a+')
	end
	
	if (errors == nil) then
		if (first) then 
			code = '/* Automatically Generated Code */\n\'use strict\';\n\n'
		end
		code = code .. 'Blockly.Blocks[\'' .. func.alias .. '\'] = { \n' ..
					'	init: function() { \n' ..
					'		this.setColour(120); \n' ..
					'		this.appendDummyInput().appendTitle(\'' .. func.alias
					if (dev.device_type == 'sensor' and dev.port ~= nil) then 
						if (dev.port ~= 0) then
							code = code .. ' (' .. dev.port .. ')'
						end
					end
					code = code .. '\'); \n		this.setInputsInline(true); \n'		
		if (tonumber(func.params) > 0) then		
			if (func.values == '') then		
				for i=1, tonumber(func.params) do
					code = code .. '		this.appendValueInput(\''.. tostring(i) .. '\'); \n' 
					if (i ~= tonumber(func.params)) then
						code = code .. '		this.appendDummyInput().appendTitle(\',\'); \n'
					end
				end
			end
		end
		if (dev.device_type == 'sensor') then
			code = code .. '		this.setOutput(true, \'Number\'); \n'
		elseif (dev.device_type == 'actuator') then
			code = code .. '		this.setPreviousStatement(true); \n' ..
						'		this.setNextStatement(true); \n'
		end
		code = code .. '		this.setTooltip(\'' .. func.tooltip .. '\'); \n' .. 
					'	} \n' .. 
					'}; \n\n'
		file:write(code)
		file:close()
	end
end

local function write_code(dev, func, first)
	--Generating scripts for lua code generator
	local file, errors
	local code = ''

	if (first) then
		file, errors = io.open(butia_code, 'w+')
	else
		file, errors = io.open(butia_code, 'a+')
	end

	if (errors == nil) then
		if (first) then 
			code = '/* Automatically Generated Code */\n\'use strict\';\n\ngoog.provide(\'Blockly.Lua.butia\');\ngoog.require(\'Blockly.Lua\');\n\n'		
		end
		code = code .. 'Blockly.Lua[\'' .. func.alias .. '\'] = function(block) { \n' .. '	var debugTrace = \'\'; \n'
		if (dev.device_type == 'actuator') then
			code = code ..	'	if (Yatay.DebugMode) { \n' ..
						'		debugTrace = \"robot.put_debug_result(\'"+ block.id +"\', M.userId)\\n"; \n' ..
						'	} \n'
		end
		local params = ''
		if (tonumber(func.params) > 0) then		
			if (func.values == '') then
				for i=1, tonumber(func.params) do
					code = code .. '	var arg' .. i .. ' = Blockly.Lua.statementToCode(block, \'' .. tostring(i) .. '\') || \'0\'; \n'
					if (params == '') then
						params = '\" + arg' .. i .. ' + \"'
					else 
						params = params .. ', \" + arg' .. i .. ' + \"'
					end			
				end
			else 
				params = tostring(func.values)
			end
		end
		code = code .. '	return debugTrace + \"robot.execute(\'' .. dev.name .. '\',\'' .. func.name .. '\',{' .. params .. '}, M.userId)\"; \n' .. '}; \n\n'
		file:write(code)
		file:close()
	end
end

local function write_script(dev, func, first)
	--Call writers
	write_blocks(dev, func, first)
	write_code(dev, func, first)
	return func.alias
end

M.refresh_devices = function()
	local new_devices = M.list_devices_functions('any')

	if (compare(M.active_devices, new_devices)) then
		print('YATAY: nothing to refresh')
		return false
	else 
		print('YATAY: must refresh devices')
		yatayBlocksRefresh = ''
		local c =	coroutine.create(
			function (old, new)
				M.refresh(old, new)
			end)
		coroutine.resume(c, M.active_devices, new_devices)
		M.active_devices = new_devices
		return true	
	end
end

local function missing_check(old_devices, name) 
	if old_devices ~= nil then
		for i=#old_devices, 1, -1 do
			for j=#old_devices[i].functions, 1, -1 do
					if old_devices[i].functions[j].alias == name then
						table.remove(old_devices[i].functions, j)
					end			
			end		
		end
	end
end

M.refresh = function(old_devices, new_devices)
	print('YATAY: refreshing!')
	local first = true
	local blocks = ''
	local unavailable = ''
	local missing = ''
	
	if (new_devices ~= nil) then
		for i=1, #new_devices do 
			if (new_devices[i] ~= nil) then 
				for j=1, #new_devices[i].functions do
					if (new_devices[i].functions[j] ~= nil) then
						missing_check(old_devices, new_devices[i].functions[j].alias)					
						local block_type = write_script(new_devices[i], new_devices[i].functions[j], first)			
						if (not new_devices[i].functions[j].available) then
							unavailable = unavailable .. block_type .. ','
						end
						blocks = blocks .. '<block type="' .. block_type .. '">'
						if (new_devices[i].functions[j].values == '') then		
							for k=1, tonumber(new_devices[i].functions[j].params) do
								blocks = blocks.. '<value name="'.. tostring(k) ..'"><block type="math_number"><title name="NUM">1</title></block></value>'
							end
						end
						blocks = blocks ..'</block>'
						first = false
					end
				end
			end
		end
	end
	
	if (old_devices ~= nil) then
		for i=1, #old_devices do 
			if (old_devices[i] ~= nil) then 
				for j=1, #old_devices[i].functions do
					if (old_devices[i].functions[j] ~= nil) then
						local block_type = write_script(old_devices[i], old_devices[i].functions[j], false)
						if (missing ~= nil) then
							missing = missing .. block_type .. ','
						end
					end
				end
			end
		end
	end
	
	local result = {}
	result.blocks = blocks
	result.unavailable = unavailable
	result.missing = missing
	yatayBlocksRefresh = json.encode(result)
	sched.signal('BlocksRefresh')
end

M.init = function(conf) 
	print('YATAY: RobotInterface is up...')
	if yatayBlocksRefresh == nil then
		yatayBlocksRefresh = ''	
	end
	sched.sigrun({'StopActuators!'}, M.stopActuators)
	--Refresh robotics devices
	M.active_devices = M.list_devices_functions('any')
	M.refresh(nil, M.active_devices)
end

return M
