const express = require('express')
const router = express.Router()
const { ObjectID } = require('mongodb')
const { authenticatePhone } = require('./../middleware/authenticate')

const { Sticker } = require('./../models/sticker')
const { User } = require('./../models/user')

router.get("/mySticker", authenticatePhone, (req, res) => {
  User
    .findOne({ _id: req.decoded.userId })
    .populate('mySticker.sticker')
    .then(data => {
      const stickers = data.mySticker
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
router.post("/getStickerQR", authenticatePhone, (req, res) => {
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
            )
            .then(data => {
              const missionIdFirst = '59f75ed47214b5998337d0cc'
              const missionIdSecond = '59f75ef47214b5998337d51f'
              const checkMission = data.myMission.find(mission => {
                const findMissionFirst = ((mission.mission).toString() === missionIdFirst) && (mission.done === false)
                const findMissionSecond = ((mission.mission).toString() === missionIdSecond) && (mission.done === false)
                return findMissionFirst || findMissionSecond
              })

              if (checkMission) {
                User
                  .findOneAndUpdate(
                    { _id: req.decoded.userId, 'myMission.mission': checkMission.mission },
                    { $set: { 'myMission.$.done': true }}
                  )
                  .then(() => {
                    let missionMessage = ''
                    if (checkMission.mission.toString() === missionIdFirst) {
                      missionMessage = 'คุณได้ผ่านภารกิจการหาสติกเกอร์นักเตะจากรายการ True4you ได้รับรางวัลสติกเกอร์ 10 ใบ กดรับได้ทันที'
                    } else if (checkMission.mission.toString() === missionIdSecond) {
                      missionMessage = 'คุณได้ผ่านภารกิจการหาสติกเกอร์นักเตะจากรายการถ่ายทอดสดฟุตบอล ได้รับรางวัลสติกเกอร์ 10 ใบ กดรับได้ทันที'
                    }

                    res.send({
                      success: true,
                      missionId: checkMission.mission,
                      missionMessage: missionMessage,
                      message: 'คุณได้รับสติกเกอร์ใหม่ 1 ชิ้น',
                      dataSticker: sticker
                    })
                  })
                  .catch(e => res.status(400).send({success: false, message: 'พบความผิดพลาด'}))
              } else {
                res.send({
                  success: true,
                  message: 'คุณได้รับสติกเกอร์ใหม่ 1 ชิ้น',
                  dataSticker: sticker
                })
              }
            })
            .catch(e => res.status(400).send({success: false, message: 'พบความผิดพลาด'}))
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