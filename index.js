const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const { body, validationResult } = require('express-validator');
const questions = require('./routes/questions/questions')

const app = express()

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use('/questions', questions)

app.set('view engine', 'ejs')
app.set('views', 'views')

PORT = 3000 || process.env.PORT



app.post('/', 
    // check if type is valid and if post req is not empty
    body("query").isString().notEmpty().withMessage("Empty Query Request"),

    // remove extra white space with regex
    body("query").customSanitizer(value => {
        return value.replace(/\s+/gm, " ")
    }),

    // put a cap so users can not abuse server req with long queries
    body("query").custom((value) => {
        if (value.length <= 2000) return true
        return false
    }).withMessage("Query Size Too Large"),

    // check if query contains certain restricted keywords because db can not be modified
    body("query").custom((value) => {
        const subStr = ['alter', 'create', 'drop', 'update', 'insert']
        let valid = true
        console.log(value)
        subStr.forEach(str => {
            let regex = new RegExp(`(?<=\\s|^)${str}(?=\\s|;|$)+`,'g')
            if (regex.test(value)){
                valid = false;
            }   
        })
        return valid;
    }).withMessage("Database Can't Be Modified"),

    (req, res, next) => {
        const result = validationResult(req)

        console.log(result)

        if (!result.isEmpty()){ 
            res.json({rows:[]})
            return;
        }

        next();
    });

app.post('/', (req, res) => {

    let tb = []
    
    let db = new sqlite3.Database('./db/chinook.db', (err)=>{
        if (err) {
            throw err
        }
        console.log('Connected to the in-memory SQlite database.');
    });

    db.serialize(() => {
        db.each(req.body.query, [], function(err, row){
            if (typeof row === 'undefined') {
                return
            }
            tb.push(row)
        }).close((err) => {
            console.log('Close the database connection.');
            res.json({rows: tb}) 
        });
    })
})
app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})

