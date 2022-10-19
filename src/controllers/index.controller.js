const queryData = require("../services/queryData");

function resQuery(req, res){
    queryData(req.body.query, req.body.offset).then(response => {
        res.json({rows: response})
    }).catch(err => {
        res.json({rows: err})
    })
}

module.exports = resQuery