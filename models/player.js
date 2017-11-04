const mongoose = require('mongoose');

const { Team } = require('./team')
const { Sticker } = require('./sticker')

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
  },
  abilityPic : {
    type: String
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  sticker: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sticker'
  }]
})

const Player = mongoose.model('Player', playerSchema)

module.exports = { Player }