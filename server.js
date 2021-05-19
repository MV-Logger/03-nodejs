const express = require("express");
const repo = require("./logs_repository.js");
const user = require("./user_repository.js");
const auth = require("./auth.js");
const http = require("http");
const cors = require("cors");
const sha512 = require("js-sha512").sha512
const cookieParser = require("cookie-parser");
const {body, validationResult} = require('express-validator');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
const router = express.Router();
app.use('/api', router);


router.post("/users/register", body("username").isString(), body("password").isString(), async (req, resp) => {
    const username = req.body.username
    if (!await user.checkUsername(username)) return resp.sendStatus(406);

    await user.registerUser(username, sha512(req.body.password))
    resp.sendStatus(201);
})

router.post("/users/login", async (req, resp) => {
    const id = await user.login(req.body.username, sha512(req.body.password));
    if (typeof id != "number") return resp.sendStatus(404);
    resp
        .cookie("access_token", auth.generateAccessToken(id), {httpOnly: true})
        .sendStatus(200)
})

router.get("/authenticated", auth.verifyJWT, (req, resp) => {
    resp.sendStatus(200);
});

router.get("/books", auth.verifyJWT, async (req, resp) => {
    resp.json(await repo.getBooks(req.id));
})

router.post("/books", auth.verifyJWT, body("name").isString(), async (req, resp) => {
    await repo.addBook(req.body.name, req.id)
    resp.sendStatus(201);
})

router.get("/entries/:bookId", auth.verifyJWT, async (req, resp) => {
    resp.json(await repo.getEntries(req.params.bookId));
})


router.post("/entries", auth.verifyJWT,
    body("bid").isNumeric(),
    body("text").isString(),
    body("when").isString(),
    body("where").isString(),
    async (req, resp) => {
        await repo.addEntry(req.body.bid, req.body.text, req.body.when, req.body.where)
        resp.sendStatus(201);
    }
)
const server = http.createServer(app);
const port = 5000
server.listen(port);
console.log(`server online on port: ${port}`)
