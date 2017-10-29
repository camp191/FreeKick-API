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
  missionCondtion: {
    type: String,
  },
  reward: {
    type: Number,
    require: true,
  },
})

const Mission = mongoose.model('Mission', missionSchema)

module.exports = { Mission }