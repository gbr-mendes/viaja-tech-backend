const express = require('express')
const leadControllers = require('../controllers/leadControllers')
const router = express.Router()

router.get('/', leadControllers.getLeads)
router.get('/:id', leadControllers.getLeadById)

module.exports = router
