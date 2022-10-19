const express = require('express')
const {body, validationResult} = require('express-validator');
const app = express()

const questions = require('./src/routes/questions/questions')
const resQuery = require("./src/controllers/index.controller")

app.use(express.json())
app.use(express.static('src/views/public'))
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.set('views', 'src/views')

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
        const subStr = ['alter', 'create', 'drop', 'update', 'insert', 'backup']
        let valid = true

        subStr.forEach(str => {
            let regex = new RegExp(`(?<=\\s|^)${str}(?=\\s|;|$|))+`,'g')
            if (regex.test(value.toLowerCase())){
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

app.use('/questions', questions)

app.post('/', resQuery)

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('*', (req, res)=>{
    res.status(400).render('error/error.400.ejs')
})
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})

