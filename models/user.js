const mongoose = require('mongoose')

const { Player } = require('./player')
const { Sticker } = require('./sticker')
const { Match } = require('./match')

const userSchema = mongoose.Schema({
  auth: [{
    email: String,
    name: String,
    username: String,
    picture: String,
    token: String,
  }],
  myTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  manpoint: {
    type: Number,
    require: true
  },
  matchpoint: {
    type: Number,
    require: true,
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