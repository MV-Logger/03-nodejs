const {Client} = require('pg')
const dotenv = require("dotenv")
dotenv.config();
const uri = process.env.DATABASE_URL;


console.log(uri)

const connection = new Client({uri,
    ssl: {
        rejectUnauthorized: false
    }
});

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