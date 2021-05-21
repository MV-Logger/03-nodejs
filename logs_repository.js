const query = require("./connection.js").query

async function getBooks(user) {
    return await query(`select *
                  from books
                  where user_id = ?`, user);
}

async function getBook(id) {
    return await query(`select *
                        from books
                        where id = ?`, id)
}

async function getEntries(book) {
    return await query(`select *
                        from entries
                        where book_id = ?`, book);
}

async function addEntry(bid, text, where, when) {
    return await query("insert into entries set ?", {book_id: bid, text: text, where: where, when: when});
}

async function addBook(name, creator) {
    return await query(`insert into books
                        set ?`, {name: name, user_id: creator});
}

async function deleteBook(id) {
    return await query(`delete
                        from books
                        where id = ?`, id)
}

async function updateBook(id, newName) {
    return await query(`update books
                        set name = ?
                        where id = ?`, newName, id)
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

