const jwt = require('jsonwebtoken')

const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET

const checkUserAuthenticated = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        next()
    } else {
        try {
            jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
                if (err) {
                    req.locals.user = null
                    next()
                } else {
                    let user = await User.findOne({_id: decodedToken.user.id}).select('-password')
                    res.locals.user = user
                    req.user = user
                    res.redirect('/dashboard')
                    next()
                }
            })
        } catch (err) {
            console.log(err)
            next()
        }
    }
}

module.exports = checkUserAuthenticated