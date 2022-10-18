const express = require('express')
const router = express.Router()
const validateQuery = require("../../controllers/questions.controller")

router.post('/:num', validateQuery)

module.exports = router