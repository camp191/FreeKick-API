const mongoose = require('mongoose')

const matchSchema = mongoose.Schema({
  matchName: {
    type: String,
    require: true,
    minlength: 1,
  },
  matchPicture: {
    type: String,
    require: true,
    minlength: 1,
  },
  matchDetail: {
    type: String,
  },
  matchDescription: {
    type: String,
  },
  matchCondtion: {
    type: String,
  },
  matchPoint: {
    type: Number,
    require: true
  },
  matchTime: {
    type: Number,
    require: true
  }
})

const Match = mongoose.model('Match', matchSchema)

module.exports = { Match }