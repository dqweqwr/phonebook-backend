const mongoose = require("mongoose")

const argc = process.argv.length
const argv = process.argv
const password = argv[2]
const name = argv[3]
const number = argv[4]

if (argc < 3) {
  console.log("Please add your password")
  process.exit(1)
}

const url = 
  `mongodb+srv://pnpmtrud:${password}@cluster0.f8nm1u5.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model("Person", personSchema)

if (argc === 5) {
  const person = new Person({
    name: name,
    number: number, 
  })

  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else if (argc === 3) {
  Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  mongoose.connection.close()
}

