const isArrayEqual = require("../utils/isEqual")
const queryData = require("../services/queryData");
const q = require("../configs/questions.config")

function validateQuery(req, res){
    let trueLabel = []
    let test = []

    queryData(q.questions[req.params.num-1], 0).then(response => {
        trueLabel = response
        return queryData(req.body.query, 0)
    }).then(response => {
        test = response
        res.json({valid: isArrayEqual(trueLabel, test), rows: test})
    }).catch(err => {
        res.json({valid: false, rows: err})
    })
}

module.exports = validateQuery