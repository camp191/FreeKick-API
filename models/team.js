const mongoose = require('mongoose')

const {Mission} = require('./mission')

const teamSchema = mongoose.Schema({
  teamName: {
    type: String,
    require: true
  },
  teamImage: {
    type: String,
    require: true
  },
  mission: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mission' }]
})

const Team = mongoose.model('Team', teamSchema)

module.exports = { Team }
