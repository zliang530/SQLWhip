const queryData = require("../services/queryData");

function resQuery(req, res){
    let tb = []
    queryData(req.body.query, req.body.offset).then(response => {
        tb = response
        res.json({rows: tb})
    }).catch(err => {
        res.json({rows: err})
    })
}

module.exports = resQuery