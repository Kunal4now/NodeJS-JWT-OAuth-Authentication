const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const CLIENT_ID = process.env.CLIENT_ID
const JWT_SECRET = process.env.JWT_SECRET

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

const validationResult = require('express-validator')

exports.getLogIn = (req, res) => {
    res.render('login', {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_LOGIN_URI: process.env.GOOGLE_LOGIN_URI,
        GOOGLE_LOGIN_URL: process.env.GOOGLE_LOGIN_URL,
        LOGIN_URL: process.env.LOGIN_URL,
        SIGNUP_URL: process.env.SIGNUP_URL
    })
}

exports.getSignUp = (req, res) => {
    res.render('signup')
}

exports.postLogIn = async (req, res) => {
    try {
        const {email, password} = req.body;
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
        res.cookie('token', authToken, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true})
        res.json({authToken: authToken, success: true})
    } catch(error) {
        console.log(error.message)
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
        const authToken = jwt.sign(data, JWT_SECRET)
        res.cookie('token', authToken, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true})
        res.status(200).json({success: true})
    } catch (err) {
        return res.status(400).json({messg: err, success: false})
    }
}

exports.logout = (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
}

exports.googleLogIn = async (req, res) => {
    const token = req.body.data
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID
        })
        const payload = ticket.getPayload()
        const userEmail = payload['email']
        const userName = payload['name']

        let user = await User.findOne({email: userEmail})
        if (!user) {
            user = await User.create({
                name: userName,
                email: userEmail,
                provider: ['Google'],
                password: "what"
            })
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.cookie('token', authToken, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true})
        res.status(200).json({success: true})
    } catch(error) {
        res.status(500).json({error: error, success: false})
    }
}