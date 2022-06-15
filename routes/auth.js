const express = require('express')
const router = express.Router()
const {body} = require('express-validator')

const authController = require('../controllers/auth-controller')

router.get('/login', authController.getLogIn)

router.get('/signup', authController.getSignUp)

router.post('/login',[
    body('email', 'Enter a valid email address').isEmail().isLength({max: 1000}),
    body('password', 'Password must be atleast 5 character long').isLength({min: 5, max: 1000})
], authController.postLogIn)

router.post('/signup', [
    body('name', 'Enter a valid username').isLength({min: 2, max: 100}),
    body('email', 'Enter a valid email address').isEmail().isLength({max: 1000}),
    body('password', 'Password must be atleast 5 character long').isLength({min: 5, max: 1000})
], authController.postSignUp)

router.get('/logout', authController.logout)

router.post('/google/login', authController.googleLogIn)

module.exports = router