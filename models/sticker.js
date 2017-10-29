const mongoose = require('mongoose') 

const { Player } = require('./player')
const { Team } = require('./team')

const stickerSchema = mongoose.Schema({
  stickerName: {
    type: String,
    require: true
  },
  stickerImage: {
    type: String,
    require: true
  },
  player: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
})

const Sticker = mongoose.model('Sticker', stickerSchema)

module.exports = { Sticker }