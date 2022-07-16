const express = require('express')

// utils
const upload = require("../utils/multer")

// middlewares
const { authenticationRequired } = require('../middlewares/authMiddlewares')

// controller
const userControllers = require('../controllers/userControllers')

const router = express.Router()

// routes setup
router.post('/register', userControllers.createUser)
router.post('/login', userControllers.loginUser)
router.get('/verify-token', authenticationRequired, userControllers.verifyToken)
router.get('/me', authenticationRequired, userControllers.getMe)
router.patch('/update', authenticationRequired, userControllers.updateMe)
router.put('/avatar', authenticationRequired, upload.single("image"), userControllers.updateAvatar)

module.exports = router