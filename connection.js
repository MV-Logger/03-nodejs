const mysql = require("mysql")
const config = require("./config.json")
const connection = mysql.createConnection(config);

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

exports.connection = connection;