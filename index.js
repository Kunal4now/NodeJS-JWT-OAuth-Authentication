require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')
const connectToMongo = require('./db')
const cors = require('cors')

const port = process.env.PORT

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

var corsOptions = {
    origin: "*",
};

app.use(cors(corsOptions));

app.set('view engine', 'ejs')
app.use(express.json())

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(cookieparser())

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

app.listen(port, () => {
    console.log(`listening on https://localhost:${port}`)
})

connectToMongo()