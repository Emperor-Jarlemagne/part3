
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('useFindAndModify', false)

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('Connectd to MONGO DB')
    })
    .catch((error) => {
        console.log('Error connecting to MONGO:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

module.exports = mongoose.model('Person', personSchema)