const connectToDatabase = require('../utils/db.connection')

function queryData(sqlString, offset){

    return new Promise((resolve, reject) => {
        let data = []
        let db = connectToDatabase()
        const newSqlString = `select * from (${sqlString}) limit 50 offset ${offset*50}`
        db.each(newSqlString, [], function(err, row){
            if (err) {
                reject([])
            }
            data.push(row)
        }).close(err => {
            if (err){
                reject([])
            }
            resolve(data)
            console.log("Closing Database")
        })
    })
}

module.exports = queryData