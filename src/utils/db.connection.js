const sqlite3 = require('sqlite3').verbose();

// connect to db and return an instance
function connectToDatabase(){
    let db = new sqlite3.Database('./src/db/chinook.db', (err)=>{
        if (err) {
            throw err
        }
        console.log('Connected to the in-memory SQlite database.');
    });
    return db
}

module.exports = connectToDatabase
