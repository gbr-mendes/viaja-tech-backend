const express = require('express')

// controller
const leadControllers = require('../controllers/leadControllers')

// middlewares
const { verifyPermission } = require('../middlewares/permissionsMiddleware')
const { authenticationRequired } = require('../middlewares/authMiddlewares')

const router = express.Router()
// routes setup
router.get('/', authenticationRequired, verifyPermission(["isAdmin", "isSalesManager"]), leadControllers.getLeads)
router.get('/:leadId', authenticationRequired, verifyPermission(["isAdmin", "isSalesManager"]), leadControllers.getLeadById)

module.exports = router
