const express = require('express')
const { authenticationRequired, checkRolesSetOnUserCreation } = require('../middlewares/authMiddlewares')
const upload = require("../utils/multer")
const router = express.Router()

const userControllers = require('../controllers/userControllers')

router.post('/register', userControllers.createUser)
router.post('/login', userControllers.loginUser)
router.get('/verify-token', authenticationRequired, userControllers.verifyToken)
router.get('/me', authenticationRequired, userControllers.getMe)
router.patch('/update', authenticationRequired, userControllers.updateMe)
router.put('/avatar', authenticationRequired, upload.single("image"), userControllers.updateAvatar)

module.exports = router