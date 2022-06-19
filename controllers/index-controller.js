const User = require('../models/User')

// Renders the home page
exports.getHome = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user.id}).select('-password')
        res.render('dashboard', {user: user.name})
    } catch(error) {
        console.log(error)
    }
}

// Renders the dashboard with the user's name on it
exports.getDashboard = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user.id}).select('-password')
        res.render('dashboard', {user: user.name})
    } catch(error) {
        console.log(error)
    }
}