const express = require('express')
const router = express.Router()
const { ObjectID } = require('mongodb')
const { authenticatePhone } = require('./../middleware/authenticate')

const { Sticker } = require('./../models/sticker')

router.post("/addSticker", (req, res) => {
  let sticker = new Sticker({
    stickerImage: req.body.stickerImage,
    playerId: req.body.playerId
  })

  sticker.save().then(
    data => {
      res.send({data})
    }
  )
})

router.get("/:playerId", (req, res) => {
  const playerId = req.params.playerId

  Sticker
    .find({ playerId: playerId })
    .populate('playerId')
    .then(data => {
      res.send({sticker: data})
    }, (e) => {
      res.status(400).send({ success: false, message: 'พบความผิดพลาด' })
    })
})

module.exports = router