const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")
dotenv.config();

function generateAccessToken(id) {
    return jwt.sign({id: id}, process.env.TOKEN_SECRET, {expiresIn: '3d'});
}

function verifyJWT(req, res, next) { // supports authentication through httpOnly cookie or token bearer
    const cookies = req.cookies;
    const bearer = req.headers.authorization
    const token = bearer ? bearer.split(' ')[1] : cookies.access_token; // if no bearer present then check for cookie

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
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