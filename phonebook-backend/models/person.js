require('dotenv').config()

const mongoose = require('mongoose')
const uniqueValidator = require("mongoose-unique-validator")
//mongoose.set("useFindAndModify", false)
mongoose.set("strictQuery", false)

const uri = process.env.MONGODB_URI

console.log('farting to', uri)

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
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
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{2}-\d{7}$/.test(v) |
                /^\d{3}-\d{8}$/.test(v) |
                /^\d{3}-\d{8}$/.test(v) |
                /^\d{3}-\d{3}-\d{4}$/.test(v) |
                /\d{8}/.test(v) |
                /\d{9}/.test(v) |
                /\d{10}/.test(v) |
                /\d{11}/.test(v)
            },
            message: props => `${props.value} is not a valid string!`
        },
        required: [true, 'Number is in Incorrect Format']
    }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)