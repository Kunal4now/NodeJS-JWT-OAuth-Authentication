require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyparser = require('body-parser')

const port = process.env.PORT

app.use(morgan('dev'))

app.set('view engine', 'ejs')
app.use(express.json())

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

app.listen(port, () => {
    console.log(`listening on https://localhost:${port}`)
})

