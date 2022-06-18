const express = require('express')
const router = express.Router()
const fetchuser = require('../middlewares/fetchUser')

const indexController = require('../controllers/index-controller')

// Middleware to check if the user is already signed in
const checkUserAuthenticated = require('../middlewares/checkUserAuthenticated')

// Route to display home page
router.get('/', checkUserAuthenticated , indexController.getHome)

// Route to display user dashboard
router.get('/dashboard', fetchuser, indexController.getDashboard)

module.exports = router