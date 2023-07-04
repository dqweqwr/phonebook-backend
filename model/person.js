const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URI
console.log("Connecting to", url)

mongoose.connect(url)
  .then(() => {
    console.log("Successfully connected")
  })
  .catch(err => {
    console.log("Failed due to error:", err.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (num) => {
        return /^\d{2,3}-\d+$/.test(num)
      },
      message: props => `${props.value} is not a valid phone number! Example of valid number: 00-000000 or 000-000000`
    }
  },
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Person", personSchema)
