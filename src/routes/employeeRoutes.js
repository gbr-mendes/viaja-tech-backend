const express = require('express')
const router = express.Router()

// controller
const controller = require('../controllers/employeeController')

// middlewares
const { authenticationRequired } = require('../middlewares/authMiddlewares')
const { verifyPermission } = require('../middlewares/permissionsMiddleware')

// routes setup
router.post('/', authenticationRequired, verifyPermission(["isAdmin"]), controller.createEmployee)
router.get('/', authenticationRequired, verifyPermission(["isAdmin"]), controller.getEmployees)
router.get('/:employeeId', authenticationRequired, verifyPermission(["isAdmin"]), controller.getEmployeeById)

module.exports = router