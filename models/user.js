const mongoose = require('mongoose')

const { Player } = require('./player')
const { Team } = require('./team')
const { Sticker } = require('./sticker')
const { Match } = require('./match')
const { Mission } = require('./mission')

const userSchema = mongoose.Schema({
  auth: {
    phone: {
      phoneNumber: {
        type: String,
        unique: true
      },
      name: String,
      username: String,
      password: String
    }
  },
  myTeam: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  myMission: [{
    mission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mission'
    },
    done: {
      type: Boolean,
      default: false
    }
  }],
  manpoint: {
    type: Number,
    require: true,
    default: 0
  },
  matchpoint: {
    type: Number,
    require: true,
    default: 0
  },
  sticker: [{
    sticker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sticker'
    },
    open: {
      type: Boolean,
      default: false
    },
    amount: Number,
    timeStamp: Date
  }],
  myMatch: [{
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match'
    },
    watch: {
      type: Boolean,
      default: false
    }
  }]
})

const User = mongoose.model('User', userSchema)

module.exports = { User }