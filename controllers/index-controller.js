const User = require('../models/User')

exports.getHome = (req, res) => {
    res.render('index')
}

exports.getDashboard = async (req, res) => {
    try {
        res.render('dashboard', {user: req.user.name})
    } catch(error) {
        console.log(error)
    }
}