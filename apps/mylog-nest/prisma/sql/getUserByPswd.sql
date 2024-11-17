-- @param {String} $1:name 用户名
-- @param {String} $2:pswd 密码
SELECT `id` userid 
FROM `user` 
WHERE name=? AND pswd=SHA(?)