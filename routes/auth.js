const express = require('express')
const router = express.Router()
const {body} = require('express-validator')

const authController = require('../controllers/auth-controller')

// Validation constraints for username
const usernameValidation = body('username', 'Enter a valid username').isLength({min: 2, max: 100})

// Validation constraints for email and password
const emailAndPasswordValidation = [
    body('email', 'Enter a valid email address').isEmail().isLength({max: 1000}),
    body('password', 'Password must be atleast 5 character long').isLength({min: 5, max: 1000})
]

// Middleware to check if the user is already signed in
const checkUserAuthenticated = require('../middlewares/checkUserAuthenticated')

// Route to display login page
router.get('/login', checkUserAuthenticated, authController.getLogIn)

// Route to display signup page
router.get('/signup', checkUserAuthenticated,  authController.getSignUp)

// API endpoint to login the user and generate JWT token
router.post('/login', emailAndPasswordValidation, checkUserAuthenticated,  authController.postLogIn)

// API endpoint to register a user and generate JWT token
router.post('/signup',usernameValidation, emailAndPasswordValidation, checkUserAuthenticated, authController.postSignUp)

// Route to display logout page
router.get('/logout', authController.logout)

// API endpoint for Google OAuth2.0 flow and JWT token generation
router.post('/google/login', authController.googleLogIn)

module.exports = router