const mysql = require("mysql")
const config = require("./config.json")
const connection = mysql.createConnection(config);

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to DB!');
});

async function query(sql, ...args) {
    return new Promise((res, rej) => {
        connection.query(sql, [...args], (err, result) => {
            if (err) rej(err);
            res(result);
        })
    })
}


exports.query = query