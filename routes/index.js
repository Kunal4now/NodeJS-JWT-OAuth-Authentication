const express = require('express')
const router = express.Router()
const fetchuser = require('../middlewares/fetchUser')

const indexController = require('../controllers/index-controller')

router.get('/', indexController.getHome)

router.get('/dashboard', fetchuser, indexController.getDashboard)

module.exports = router