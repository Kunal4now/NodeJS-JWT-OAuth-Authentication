const User = require('../models/User')

// Renders the home page
exports.getHome = (req, res) => {
    res.render('index')
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