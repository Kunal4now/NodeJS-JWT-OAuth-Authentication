require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')
const connectToMongo = require('./db')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')

const port = process.env.PORT

// Logging requests in development environment
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// API limiter to limit the no. of requests in a particular interval of time
const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 50000,
    message: 'Too many requests from this IP, please try again after 15 minutes'
})

var corsOptions = {
    origin: "*",
};

// CORS to restrict the API endpoints (in this case allowing them to originate from anywhere)
app.use(cors(corsOptions));

// Sets the view engine as EJS
app.set('view engine', 'ejs')
app.use(express.json())

// Middleware to parse the incoming request body
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

// Middleware will parse the Cookie header on the request and expose the cookie data as the property req.cookies
app.use(cookieparser())

// Late limiter to prevent DoS attack
app.use(apiLimiter)

// Middleware to prevent Cross-Site-Scripting by sanitizing the input
app.use(xss())

// Middleware to sanitize user input data to prevent MongoDB injection attacks
app.use(mongoSanitize())

// Index route for landing page and dashboard
app.use('/', require('./routes/index'))

// Authentication route
app.use('/auth', require('./routes/auth'))

app.listen(port, () => {
    console.log(`listening on https://localhost:${port}`)
})

// Database configuration and connection
connectToMongo()