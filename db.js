const mongoose = require('mongoose')
const mongoURI = process.env.MONGODB_URI

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log('Connected to MongoDB sucessfully')
    })
}

module.exports = connectToMongo