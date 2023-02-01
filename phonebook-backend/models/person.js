require('dotenv').config()

const mongoose = require('mongoose')
const uniqueValidator = require("mongoose-unique-validator")
//mongoose.set("useFindAndModify", false)
mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URI

console.log('farting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true,
    },
    number: {
        type: String,
        minlength: 8,
        required: true,
        unique: true,
        match: [
            /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/,
            /^(\()?\d{2}(\))?(-|\s)?\d{4}(-|\s)\d{4}$/,
            /^(\()?\d{2}(-|\s)\d{7}$/,
            /^(\()?\d{3}(-|\s)\d{8}$/,
        ]
    }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

module.exports = mongoose.model('Person', personSchema)