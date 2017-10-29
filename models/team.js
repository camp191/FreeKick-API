const mongoose = require('mongoose')

const { Player } = require('./player')

const teamSchema = mongoose.Schema({
  teamName: {
    type: String,
    require: true
  },
  teamImage: {
    type: String,
    require: true
  },
  player: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }]
})

const Team = mongoose.model('Team', teamSchema)

module.exports = { Team }
