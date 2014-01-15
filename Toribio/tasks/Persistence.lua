local M = {}

local sqlite3 = require('lsqlite3')

local db = sqlite3.open('Yatay.db')

local exist_stmt
local insert_stmt
local update_stmt

M.exist = function(key)
	assert(exist_stmt:bind_values(key) == sqlite3.OK)
	local result = false 
	for row in exist_stmt:nrows() do
		result = true		
	end	
	return result
end

M.update = function(key, task)
	assert(update_stmt:bind_values(task, key) == sqlite3.OK)	
	assert(update_stmt:step() == sqlite3.DONE)	
	assert(update_stmt:finalize() == sqlite3.OK)
end

M.insert = function(key, task)
	assert(insert_stmt:bind_values(key, task) == sqlite3.OK)
	assert(insert_stmt:step() == sqlite3.DONE)
	assert(insert_stmt:finalize() == sqlite3.OK)
end

M.init = function(conf)
	db:exec('CREATE TABLE Yatay (name VARCHAR PRIMARY KEY, code VARCHAR)')
	db:exec('commit')
	
	exist_stmt = assert(db:prepare('SELECT * FROM Yatay WHERE name = ?'))
	insert_stmt = assert(db:prepare('INSERT INTO Yatay VALUES (?, ?)'))
	update_stmt =  assert(db:prepare('UPDATE Yatay SET code = ? WHERE name = ?'))

	print('DataBase is up...')
--	assert(db:close() == sqlite3.OK)
end

return M
