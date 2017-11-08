const express = require('express')
const router = express.Router()
const { ObjectID } = require('mongodb')
const { authenticatePhone } = require('./../middleware/authenticate')

const { Sticker } = require('./../models/sticker')
const { User } = require('./../models/user')

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

// router.get("/:playerId", (req, res) => {
//   const playerId = req.params.playerId

//   Sticker
//     .find({ playerId: playerId })
//     .populate('playerId')
//     .then(data => {
//       res.send({sticker: data})
//     })
// })

router.get("/mySticker", authenticatePhone, (req, res) => {
  User
    .findOne({ _id: req.decoded.userId })
    .populate('sticker.sticker')
    .then(data => {
      const stickers = data.sticker
      const openSticker =  stickers.filter((sticker) => sticker.open === true)
      const findNotOpen = stickers.filter((sticker) => sticker.open === false)

      if (findNotOpen.length > 0) {
        res.send({
          notOpen: {
            success: true,
            amount: findNotOpen.length,
            stickerImage: 'stickerpack.png'
          },
          openSticker
        })
      } else {
        res.send({ success:true, openSticker })
      }
    })
    .catch(e => res.status(400).send({success: false, message: 'พบความผิดพลาด'}))
})

router.patch("/openPack", authenticatePhone, (req, res) => {

  User.findOne({ _id: req.decoded.userId })
    .populate('mySticker.sticker')
    .then(data => {
      const falseSticker = data.mySticker.filter((sticker) => sticker.open === false)
      const updateSticker = falseSticker.map(sticker => {
        User.findOneAndUpdate(
          { _id: req.decoded.userId, "mySticker": {$elemMatch: {open: false}} }, 
          { $set: { 'mySticker.$.open': true } }, 
          { new: true }
        )
        .then(data => {
          return data
        })
      })

      Promise.all(updateSticker).then(() => {
        res.send({
          newSticker: falseSticker,
          amount: falseSticker.length
        })
      })
    })
})

module.exports = router