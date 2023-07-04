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

// info (how many people in the database at time of visit)
app.get("/info", (request, response) => {
  Person.find({})
    .then(people => people.length)
    .then(numPeople => {
      const date = new Date().toString() 
      const body = `
        <div>
          <p>Phonebook has info for ${numPeople} people</p>
          <p>${date}</p>
        </div>    
      `
      console.log(nameUnique("asd"))
      response.send(body)
    })
})

const nameUnique = (name) => {
  // const names = persons.map(person => {
  //   return person.name
  // })
  // const unique = !names.includes(name)
  // return unique
  return Person.find({})
    .then(persons => {
      return persons.map(person => {
        return person.name
      })
    }).then(names => {
      return !names.includes(name)
    })
}

// create
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

// read
app.get("/api/persons", (request, response) => {
  Person.find({})
    .then(people => {
      response.json(people)
    })
})

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(err => next(err))
})

// update
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    }).catch(err => next(err))
})

// delete
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(err => next(err))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
