const mongoose = require('mongoose') 

const stickerSchema = mongoose.Schema({
  stickerName: {
    type: String,
    require: true
  },
  stickerImage: {
    type: String,
    require: true
  }
})

const Sticker = mongoose.model('Sticker', stickerSchema)

module.exports = { Sticker }