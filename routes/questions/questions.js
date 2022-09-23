const express = require('express')
const router = express.Router()

router.get('/:num', (req, res) => {
    res.json({1:"abc"})
})

module.exports = router