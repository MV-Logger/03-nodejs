const query = require("./connection.js").query

function getBooks(user) {
    return query(`select *
                  from book
                  where creator = ${user}`);
}

function getEntries(book) {
    return query(`select *
                  from entry
                  where bid = ${book}`);
}

function addEntry(bid, text, where, when) {
    return query("insert into entry set ?", {bid: bid, text: text, where: where, when: when});
}

function addBook(name, creator) {
    return query(`insert into book
                  set ?`, {name: name, creator: creator});
}

module.exports = {
    addBook,
    addEntry,
    getBooks,
    getEntries
}

