-- @param {String} $1:name 用户名
-- @param {String} $2:pswd 密码
SELECT `id`
FROM `userlogin` 
WHERE name=? AND pswd=SHA(?)
LIMIT 1