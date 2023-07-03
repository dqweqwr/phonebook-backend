require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const Person = require("./model/person")

const app = express()

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.use(logger)
app.use(cors())
app.use(express.json())
app.use(express.static("build"))

let persons = [
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
]

// landing page
app.get("/", (request, response) => {
  response.send(
    "<h1>Hello world</h1>"
  )
})

// get info (how many people in the database at time of visit)
app.get("/info", (request, response) => {
  const date = new Date().toString() 
  const body = `
    <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    </div>    
  `
  response.send(body)
})

// get all people
app.get("/api/persons", (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

// get a specific person based on a given id
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// delete a specific person based on given id
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const nameUnique = (name) => {
  const names = persons.map(person => {
    return person.name
  })
  const unique = !names.includes(name)
  return unique
}

// create a new person
app.post("/api/persons", (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing"
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
