const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")
dotenv.config();

function generateAccessToken(id) {
    return jwt.sign({id: id}, process.env.TOKEN_SECRET, {expiresIn: '3d'});
}

function verifyJWT(req, res, next) {
    const cookies = req.cookies;

    if (cookies.access_token) {
        jwt.verify(cookies.access_token, process.env.TOKEN_SECRET, (err, payload) => {
            if (err) return res.sendStatus(403);
            req.id = payload.id;
            next();
        })
    } else {
        res.sendStatus(401)
    }
}

module.exports = {
    generateAccessToken,
    verifyJWT
}