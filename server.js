const express = require("express");
const repo = require("./logs_repository.js");
const user = require("./user_repository.js");
const auth = require("./auth.js");
const http = require("http");
const cors = require("cors");
const sha512 = require("js-sha512").sha512
const cookieParser = require("cookie-parser");
const {body, param} = require('express-validator');
const {errorHandler, validateRequest} = require('./error.js');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
const router = express.Router();
app.use('/api', router);


router.post("/auth/register",
    body("username").isString().custom(async v => {
        if (await user.existUsername(v)) return Promise.reject(); // return rejection so validation fails
    }),
    body("password").isString().isLength({min: 5}),
    validateRequest,
    async (req, resp) => {
        await user.registerUser(req.body.username, sha512(req.body.password))
        resp.sendStatus(201);
    }
)

router.post("/auth/login", async (req, resp) => {
    const id = await user.login(req.body.username, sha512(req.body.password));
    if (typeof id != "number") return resp.sendStatus(404);
    const token = auth.generateAccessToken(id)
    resp
        .cookie("access_token", token, {httpOnly: true}) // supports both httpOnly cookie and bearer token
        .json({token: token})
})

router.get("/auth/authenticated", auth.verifyJWT, (req, resp) => {
    resp.sendStatus(200);
});

router.get("/books", auth.verifyJWT, async (req, resp) => {
    resp.json(await repo.getBooks(req.id));
})

router.post("/books", auth.verifyJWT,
    body("name").isString(),
    validateRequest,
    async (req, resp) => {

        await repo.addBook(req.body.name, req.id)
        resp.sendStatus(201);
    })

router.get("/books/:bookId/entries", auth.verifyJWT,
    param("bookId").isNumeric().exists().toInt().custom(async v => {
        if ((await repo.getBook(v)).length === 0) return Promise.reject();
    }),
    validateRequest,
    async (req, resp) => {
        resp.json(await repo.getEntries(req.params.bookId));
    }
)


router.post("/books/:bookId/entries", auth.verifyJWT,
    param("bookId").isNumeric().exists().toInt().custom(async v => {
        if ((await repo.getBook(v)).length === 0) return Promise.reject();
    }),
    body("text").exists(),
    body("when").exists(),
    body("where").exists(),
    validateRequest,
    async (req, resp) => {
        await repo.addEntry(req.params.bookId, req.body.text, req.body.when, req.body.where)
        resp.sendStatus(201);
    }
)

app.use(errorHandler)


const server = http.createServer(app);
const port = 5000
server.listen(port);
console.log(`server online on port: ${port}`)
