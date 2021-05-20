const query = require("./connection.js").query

function getBooks(user) {
    return query(`select *
                  from books
                  where user_id = ?`, user);
}

function getEntries(book) {
    return query(`select *
                  from entries
                  where book_id = ?`, book);
}

function addEntry(bid, text, where, when) {
    return query("insert into entries set ?", {book_id: bid, text: text, where: where, when: when});
}

function addBook(name, creator) {
    return query(`insert into books
                  set ?`, {name: name, user_id: creator});
}

module.exports = {
    addBook,
    addEntry,
    getBooks,
    getEntries
}

