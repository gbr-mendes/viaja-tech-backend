const express = require('express')
const leadControllers = require('../controllers/leadControllers')
const router = express.Router()
const { verifyPermission } = require('../middlewares/permissionsMiddleware')

router.get('/', verifyPermission(["isAdmin", "isSalesManager"]), leadControllers.getLeads)
router.get('/:id', verifyPermission(["isAdmin", "isSalesManager"]), leadControllers.getLeadById)

module.exports = router
