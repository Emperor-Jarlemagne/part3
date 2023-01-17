
const mongoose = require('mongoose')

if (process.argv.length < 3 || process.argv.length > 3 && process.argv.length < 5) {
    console.log('Please provide the password as an argument: node mongo.js <password> and Name/Number to be added')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://Jari:${password}@phoneapp.rfzxi5k.mongodb.net/phoneApp?retryWrites=true&w=majority`

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then((result) => {
        console.log('connected')
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
}) 

const Person = mongoose.model('Person', personSchema)

/* const person = new Person({
    name: "Gerbil Kalajarvi",
    number: 776-3453211
}) */

if (process.argv.length === 3) {
    let count = 0
    Person.find({}).then(result => {
        console.log("phonebook:\n ")
        result.forEach(person => {
            console.log(person.name, person.number)
            count += 1
        })
        mongoose.connection.close()
        console.log("\ntotal:", count)
        process.exit(0)
    })
}

const person = new Person({ 
    name: process.argv[3],
    number: process.argv[4] 
})

person.save().then(result => {
    console.log(`Added ${result.name} to Phonebook`)
    mongoose.connection.close()
})

.catch((err) => console.error(err))
