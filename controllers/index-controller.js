const User = require('../models/User')

exports.getHome = (req, res) => {
    res.render('index')
}

exports.getDashboard = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user.id})
        res.render('dashboard', {user: user.name})
    } catch(error) {
        console.log(error)
    }
}