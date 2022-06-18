const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library');
const {validationResult} = require('express-validator')

const CLIENT_ID = process.env.CLIENT_ID
const JWT_SECRET = process.env.JWT_SECRET

// OAuth2 client to verify the access token
const client = new OAuth2Client(CLIENT_ID);

// Renders the login page
exports.getLogIn = (req, res) => {
    res.render('login', {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_LOGIN_URI: process.env.GOOGLE_LOGIN_URI,
        GOOGLE_LOGIN_URL: process.env.GOOGLE_LOGIN_URL,
        LOGIN_URL: process.env.LOGIN_URL,
    })
}

// Renders the signup page
exports.getSignUp = (req, res) => {
    res.render('signup', {SIGNUP_URL: process.env.SIGNUP_URL})
}

// Logs in the user and saves the generated JWT token in the cookies
exports.postLogIn = async (req, res) => {
    let errors = validationResult(req)
    errors = errors.errors.map((err) => {
        return err.msg
    })
    if (errors.length != 0) {
       return res.status(200).json({error: errors, success: false})
    }
    try {
        const {email, password} = req.body;
        let user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({error: ["Sorry a user with this email does not exist"], success: false})
        }
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(200).json({error: ["Please try to login with correct credentials"], success: false})
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.cookie('token', authToken, {maxAge: 1000 * 60 * 60, httpOnly: true, secure: true})
        res.status(200).json({success: true})
    } catch(error) {
        res.status(500).send({error: error, success: false})
    }
}

// Registers the user and saves the generated JWT token in the cookies
exports.postSignUp = async (req, res) => {
    let errors = validationResult(req)
    errors = errors.errors.map((err) => {
        return err.msg
    })
    if (errors.length != 0) {
       return res.status(200).json({error: errors, success: false})
    }
    const {username, email, password} = req.body
    
    try {
        let user = await User.findOne({email: email})
        if (user) {
            return res.status(200).json({error: ["User already registered"], success: false})
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
        res.cookie('token', authToken, {maxAge: 1000 * 60 * 60, httpOnly: true, secure: true})
        res.status(200).json({success: true})
    } catch (error) {
        return res.status(500).json({error: error, success: false})
    }
}

// Log's out the user by clearing the token saved in cookies and redirecting the user to the home page
exports.logout = (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
}

// 1. Verifies the access token that it recieves after user gives consent to connect with google
// 2. If the user is already not registered, then it registers the user with provider as 'Google'
// 3. Generates and attaches the JWT token to the response after successful verification of access token
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
            })
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.cookie('token', authToken, {maxAge: 1000 * 60 * 60, httpOnly: true, secure: true})
        res.status(200).json({success: true})
    } catch(error) {
        res.status(500).json({error: error, success: false})
    }
}