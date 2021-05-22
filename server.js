const express = require("express");
const repo = require("./logs_repository.js");
const user = require("./user_repository.js");
const auth = require("./auth.js");
const http = require("http");
const cors = require("cors");
const bcrypt = require("bcryptjs") // using bcryptjs instead of bcrypt is bc laravel uses $y$ and bcrypt doesnt support it
const cookieParser = require("cookie-parser");
const {body, param} = require('express-validator');
const {errorHandler, validateRequest, NotFoundError} = require('./error.js');

const saltRounds = 10;
const app = express();

// adding middleware
app.use(express.json()); // parse json
app.use(cors()); //enable cors
app.use(express.urlencoded({extended: true})); // allow to parse forms
app.use(cookieParser()); // parses cookies
const router = express.Router();
app.use('/api', router);
app.use(errorHandler) // custom middleware that handles my custom errors

// adding routes + validation
router.post("/auth/register",
    body("username").isString().custom(async v => {
        if (await user.existUsername(v)) return Promise.reject(); // return rejection so validation fails
    }),
    body("password").isString().isLength({min: 5}),
    validateRequest,
    async (req, res) => {
        await user.registerUser(req.body.username,  await bcrypt.hash(req.body.password, saltRounds))
        res.sendStatus(201);
    }
)

router.post("/auth/login",
    body("username").isString(),
    body("password").isString(),
    validateRequest,
    async (req, res) => {
        const result = await user.login(req.body.username);
        if (result.length === 0 || !(await bcrypt.compare(req.body.password, result[0].password)))
            return res.sendStatus(403);

        const token = auth.generateAccessToken(result[0].id)
        res
            .cookie("access_token", token, {httpOnly: true}) // supports both httpOnly cookie and bearer token
            .json({access_token: token})
    }
)

router.get("/auth/authenticated", auth.verifyJWT, (req, res) => {
    res.sendStatus(200);
});

router.get("/books", auth.verifyJWT, async (req, res) => {
    res.json(await repo.getBooks(req.id));
})

router.post("/books", auth.verifyJWT,
    body("name").isString().isLength({max: 100}),
    validateRequest,
    async (req, res) => {

        await repo.addBook(req.body.name, req.id)
        res.sendStatus(201);
    }
)

router.get("/books/:bookId", auth.verifyJWT,
    param("bookId").isNumeric().exists().toInt().custom(async v => {
        if ((await repo.getBook(v)).length === 0) throw new NotFoundError;
    }),
    validateRequest,
    async (req, res) => {
        res.json(await repo.getBook(req.params.bookId));
    }
)

router.delete("/books/:bookId", auth.verifyJWT,
    param("bookId").isNumeric().exists().toInt().custom(async v => {
        if ((await repo.getBook(v)).length === 0) throw new NotFoundError
    }),
    validateRequest,
    async (req, res) => {
        await repo.deleteBook(req.params.bookId)
        res.sendStatus(200)
    }
)

router.put("/books/:bookId", auth.verifyJWT,
    param("bookId").isNumeric().exists().toInt().custom(async v => {
        if ((await repo.getBook(v)).length === 0) throw new NotFoundError;
    }),
    body("name").isString().isLength({max: 100}),
    validateRequest,
    async (req, res) => {
        await repo.updateBook(req.params.bookId, req.body.name)
        res.sendStatus(200)
    }
)

router.get("/books/:bookId/entries", auth.verifyJWT,
    param("bookId").isNumeric().exists().toInt().custom(async v => {
        if ((await repo.getBook(v)).length === 0) throw new NotFoundError;
    }),
    validateRequest,
    async (req, res) => {
        res.json(await repo.getEntries(req.params.bookId));
    }
)


router.post("/books/:bookId/entries", auth.verifyJWT,
    param("bookId").isNumeric().exists().toInt().custom(async v => {
        if ((await repo.getBook(v)).length === 0) throw new NotFoundError;
    }),
    body("text").exists(),
    body("when").exists(),
    body("where").exists(),
    validateRequest,
    async (req, res) => {
        await repo.addEntry(req.params.bookId, req.body.text, req.body.when, req.body.where)
        res.sendStatus(201);
    }
)

//Setting up the server
const server = http.createServer(app);
const port = process.env.PORT || 5000;
server.listen(port);
console.log(`server online on port: ${port}`)
