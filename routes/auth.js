const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth-controller')

router.get('/login', authController.getLogIn)

router.get('/signup', authController.getSignUp)

router.post('/login', authController.postLogIn)

router.post('/signup', authController.postSignUp)

module.exports = router