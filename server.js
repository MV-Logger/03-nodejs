const express = require("express");
const repo = require("./logs_repository.js");
const user = require("./user_repository.js");
const auth = require("./auth.js");
const http = require("http");
const cors = require("cors");
const sha512 = require("js-sha512").sha512

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
const router = express.Router();
app.use('/api', router);


router.post("/users/register", async (req, resp) => {
    console.log("received")
    const username = req.body.username
    if (typeof (username) != "string" || username === "") return resp.sendStatus(400);
    if (!await user.checkUsername(username)) return resp.sendStatus(406);

    await user.registerUser(username, sha512(req.body.password))
    resp.sendStatus(201);
})

router.post("/users/login", async (req, resp) => {
    const id = await user.login(req.body.username, sha512(req.body.password));
    if (typeof id != "number") return resp.sendStatus(404);
    resp
        .cookie("access_token",  auth.generateAccessToken(id), {httpOnly: true})
        .sendStatus(200)
})


const server = http.createServer(app);
const port = 5000
server.listen(port);
console.log(`server online on port: ${port}`)
