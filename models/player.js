const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  numberShirt: {
    type: Number,
    require: true,
  },
  position: {
    type: String,
    require: true
  },
  preferredFoot: {
    type: String,
    require: true
  },
  dateOfBirth: {
    type: Date,
    require: true
  },
  nationality: {
    type: String,
    require: true
  },
  height: {
    type: Number,
    require: true
  },
  description: {
    type: String
  }
})

const Player = mongoose.model('Player', playerSchema)

module.exports = { Player }