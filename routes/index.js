const express = require('express')
const router = express.Router()
const fetchuser = require('../middlewares/fetchUser')

const indexController = require('../controllers/index-controller')

// Route to display home page
router.get('/', fetchuser , indexController.getHome)

module.exports = router