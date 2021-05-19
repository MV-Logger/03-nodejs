const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")
dotenv.config();

function generateAccessToken(id) {
    return jwt.sign({id: id}, process.env.TOKEN_SECRET, {expiresIn: '3d'});
}

module.exports = {
    generateAccessToken
}