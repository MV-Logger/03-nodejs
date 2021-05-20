const query = require("./connection.js").query;

async function registerUser(username, pass) {
    return await query(`insert into users
                        set ?`, {username: username, password: pass});
}

async function login(username, pass) {
    const result = await query(`select id
                                from users
                                where LOWER(username) = LOWER(?)
                                  and password = ?`, username, pass);
    return result.length === 1 ? result[0].id : false;
}

async function existUsername(username) {
    return (await query("select * from users where LOWER(username) = LOWER(?)", username)).length === 1
}

module.exports = {
    registerUser,
    existUsername,
    login,
}