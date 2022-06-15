const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

exports.getLogIn = (req, res) => {
    res.render('login')
}

exports.getSignUp = (req, res) => {
    res.render('signup')
}

exports.create = async (req, res) => {    
    try {
        let user = await User.findOne({email: req.body.email});
        if (user) {
            return res.status(400).json({error: "Sorry a user with this email is already registered"})
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({authToken})
    } catch(error) {
        console.log(error)
        res.status(500).json(error)
    }
}

exports.postLogIn = async (req, res) => {
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({error: "Sorry a user with this email does not exist"})
        }
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({error: "Please try to login with correct credentials"})
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        // res.redirect('/dashboard')
        res.cookie('token', authToken)
        res.json({authToken: authToken, success: true})
    } catch(error) {
        console.log(error.message)
        // res.redirect('/auth/login')
        res.status(500).send("Internal Server Error")
    }
}

exports.postSignUp = async (req, res) => {
    const {username, email, password} = req.body
    
    try {
        let user = await User.findOne({email: email})
        if (user) {
            return res.status(400).json({messg: "User already registered", success: false})
        }
        const salt = bcrypt.genSaltSync(10)
        const securePassword = await bcrypt.hash(password, salt)

        user = await User.create({
            name: username,
            email: email,
            password: securePassword
        })

        const data = {
            user: {
                id: user.id
            }
        }
        req.setHeader('auth-token', authToken)
        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({authToken, success: true})
    } catch (err) {
        return res.status(400).json({messg: err, success: false})
    }
}

exports.logout = (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
}