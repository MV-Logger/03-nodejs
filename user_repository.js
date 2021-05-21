const query = require("./connection.js").query;

async function registerUser(username, pass) {
    return await query(`insert into users
                        set ?`, {username: username, password: pass});
}

async function login(username) {
    return await query(`select id, password
                                from users
                                where LOWER(username) = LOWER(?)
                                `, username);
}

async function existUsername(username) {
    return (await query("select * from users where LOWER(username) = LOWER(?)", username)).length === 1
}

module.exports = {
    registerUser,
    existUsername,
    login,
}