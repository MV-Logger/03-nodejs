const query = require("./connection.js").query

async function getBooks(user) {
    return (await query(`select *
                        from books
                        where user_id = $1`, user)).rows;
}

async function getBook(id) {
    return (await query(`select *
                        from books
                        where id = $1`, id)).rows
}

async function getEntries(book) {
    return (await query(`select *
                        from entries
                        where book_id = $1`, book)).rows;
}

async function addEntry(bid, text, where, when) {
    return (await query(`insert into entries(book_id, text, "where", "when" ) 
                            values($1, $2, $3, $4)`, bid, text, where, when)).rows;
}

async function addBook(name, creator) {
    return (await query("insert into books(`name`, user_id ) VALUES($1, $2)", name, creator)).rows;
}

async function deleteBook(id) {
    return (await query(`delete
                        from books
                        where id = $1`, id)).rows
}

async function updateBook(id, newName) {
    return (await query(`update books
                        set "name" = $1
                        where id = $2`, newName, id)).rows
}

module.exports = {
    addBook,
    addEntry,
    getBooks,
    getEntries,
    getBook,
    deleteBook,
    updateBook
}

