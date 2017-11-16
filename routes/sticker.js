const express = require('express')
const router = express.Router()
const { ObjectID } = require('mongodb')
const { authenticatePhone } = require('./../middleware/authenticate')

const { Sticker } = require('./../models/sticker')
const { User } = require('./../models/user')

// router.post("/addSticker", (req, res) => {
//   let sticker = new Sticker({
//     stickerImage: req.body.stickerImage,
//     playerId: req.body.playerId
//   })

//   sticker.save().then(
//     data => {
//       res.send({data})
//     }
//   )
// })

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

// My Album
router.get("/myAlbum", authenticatePhone, (req, res) => {
  User
    .findOne({ _id: req.decoded.userId })
    .populate({path: 'myTeam', populate: {path: 'player'}})
    .then(data => {
      res.send({myTeam: data.myTeam})
    })
})

router.get("/myStickerTeam/:teamId", authenticatePhone, (req, res) => {
  const teamId = req.params.teamId

  User
    .findOne({ _id: req.decoded.userId })
    .populate({path: 'mySticker.sticker', populate: {path: 'playerId'}})
    .then(data => {
      const myStickerTeam = data.mySticker.filter(sticker => sticker.sticker.playerId.team == teamId)
      res.send({userTeamSticker: myStickerTeam})
    })
})

// Get sticker from QR
router.post("/getSticker", authenticatePhone, (req, res) => {
  const code = req.body.code

  if (code === 1234) {
    Sticker
      .findRandom({}, {}, {limit: 1}, function(err, sticker) {
          User
            .findOneAndUpdate(
              { _id: req.decoded.userId },
              { $push: { 
                mySticker: {
                  ...sticker,
                }
              }}
            ).then(data => {
              res.send({
                success: true,
                message: 'คุณได้รับสติกเกอร์ใหม่ 1 ชิ้น',
                dataSticker: sticker
              })
            })
      })
  } else {
    res.status(400).send({success: false, message: 'รหัส QR ผิดพลาด กรุณาลองอีกครั้ง'})
  }
})

// router.patch("/useSticker", authenticatePhone, (req, res) => {
//   let stickerBtnId = req.body.stickerBtnId

//   User
//     .findOneAndUpdate(
//       { _id: req.decoded.userId, "mySticker": {$elemMatch: {use: false}} }, 
//       { $set: { 'mySticker.$.use': true } }, 
//       { new: true }
//     )
//     .populate('mySticker.sticker')
//     .exec((err, sticker) => {
//       // if (err) {
//       //   return res.status(400).send({ success: false, message: 'คุณไม่มีสติกเกอร์นี้'})
//       // }
//       res.send({
//         success: true,
//         message: 'ติดสติกเกอร์เรียบร้อย',
//         sticker: sticker
//       })
//     })
//     // .catch(e => res.status(400).send({ success: false, message: 'พบความผิดพลาด' }))
// })

module.exports = router