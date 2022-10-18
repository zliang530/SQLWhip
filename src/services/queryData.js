const connectToDatabase = require('../utils/db.connection')

function queryData(sqlString, offset){

    return new Promise((resolve, reject) => {
        const setStart = 50*offset // will be used to multiply by offset to return fifty rows at a time per request
        const setStop = setStart+50
        let counter = 0
        let data = []
        let db = connectToDatabase()

        db.each(sqlString, [], function(err, row){
            counter+=1
            if (err) {
                reject([])
            }
            if (counter>setStart && counter<=setStop){
                console.log(counter)
                data.push(row)
            }
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