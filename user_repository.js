const query = require("./connection.js").query;

async function registerUser(username, pass) {
    return await query(`insert into users(username, password)
                        values($1, $2)`, username, pass);
}

async function login(username) {
    return await query(`select id, password
                                from users
                                where LOWER(username) = LOWER($1)
                                `, username);
}

async function existUsername(username) {
    return (await query("select * from users where LOWER(username) = LOWER($1)", username)).length === 1
}

module.exports = {
    registerUser,
    existUsername,
    login,
}