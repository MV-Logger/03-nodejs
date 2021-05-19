const query = require("./connection.js").query;

async function registerUser(username, pass) {
    return await query(`insert into user
                        set ?`, {username: username, passwd: pass});
}

async function login(username, pass) {
    const result = await query(`select id
                                from user
                                where username = ?
                                  and passwd = ?`, username, pass);
    return result.length === 1 ? result[0].id : false;
}

async function checkUsername(username) {
    return (await query("select * from user where username = ?", username)).length === 0
}

module.exports = {
    registerUser,
    checkUsername,
    login,
}