const express = require('express')
const router = express.Router()

const controller = require('../controllers/employeeController')
const { authenticationRequired } = require('../middlewares/authMiddlewares')
const { verifyPermission } = require('../middlewares/permissionsMiddleware')

router.post('/', authenticationRequired, verifyPermission(["isAdmin"]), controller.createEmployee)

module.exports = router