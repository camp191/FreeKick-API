const mongoose = require('mongoose')

const missionSchema = mongoose.Schema({
  missionDesc: {
    type: String,
    require: true,
  },
  missionImage: {
    type: String,
    require: true,
  },
  missionCondition: {
    type: String,
  },
  reward: {
    type: Number,
    require: true,
  },
  typeMission: {
    type: String,
    require: true
  }
})

const Mission = mongoose.model('Mission', missionSchema)

module.exports = { Mission }