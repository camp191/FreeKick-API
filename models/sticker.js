const mongoose = require('mongoose') 

const { Player } = require('./player')
const { Team } = require('./team')

const stickerSchema = mongoose.Schema({
  stickerImage: {
    type: String,
    require: true
  },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
})

const Sticker = mongoose.model('Sticker', stickerSchema)

module.exports = { Sticker }