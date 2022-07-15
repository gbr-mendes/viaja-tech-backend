const express = require('express')
const router = express.Router()

const controller = require('../controllers/employeeController')

router.post('/', controller.createEmployee)

module.exports = router