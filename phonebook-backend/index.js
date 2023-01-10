require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const requestLogger = (request, response, next) => {
    console.log('Method', request.method)
    console.log('Path', request.path)
    console.log('Body', request.body)
    console.log('---')
    next()
}

 /* let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
] */

app.use(express.json())

app.use(requestLogger)

app.use(express.static('build'))

app.use(bodyParser.json())

morgan.token('body', (request) => { 
    return JSON.stringify(request.body) 
})

app.use(morgan(
    ':method :url :body :status :res[content-length] - :response-time ms'
))

app.use(cors())

app.get('/info', (request, response, next) => {
    Person.countDocuments({}).then(result => {
        const message = `<h1>Phonebook has info for ${result} people</h1></br><p>${new Date()}</p>`
        response.send(message).end()
    })
    .catch(error => next(error))
})
/*
const generateId = () => {
    const maxId = people.length > 0
    ? Math.max(...people.map(p => p.id))
    : 0
    return maxId + 1
}
*/
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }
    if(body.name && body.number === person) {
        return response.status(400).json({
            error: 'name or number already exists'
        })
    }

    const person = new Person({
//        id: generateId(),
        name: body.name,
        number: body.number,
        //important: body.important || false,
    })
    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(newPerson => {
            if (newPerson) {
                response.json(newPerson.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error)
}
app.use(errorHandler)


const unknownEndpoint = (request, response, next) => {
    response.status(404).send({ error : 'unknown endpoint' })
    .catch(error => next(error))
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})