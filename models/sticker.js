const mongoose = require('mongoose') 
const random = require('mongoose-simple-random')

const { Player } = require('./player')
const { Team } = require('./team')

const stickerSchema = mongoose.Schema({
  stickerImage: {
    type: String,
    require: true
  },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
})

stickerSchema.plugin(random)

const Sticker = mongoose.model('Sticker', stickerSchema)

module.exports = { Sticker }