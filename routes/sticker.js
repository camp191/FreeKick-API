const express = require('express')
const router = express.Router()
const { ObjectID } = require('mongodb')
const { authenticatePhone } = require('./../middleware/authenticate')

const { Sticker } = require('./../models/sticker')
const { User } = require('./../models/user')


router.get("/mySticker", authenticatePhone, (req, res) => {
  User
    .findOne({ _id: req.decoded.userId })
    .populate({path: 'mySticker.sticker', populate: { path: 'playerId', populate: { path: 'team'} }})
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
        const missionId = '59f75e424837d11fdfee35a0'
        const checkMission = data.myMission.find(mission => {
          return ((mission.mission).toString() === missionId) && (mission.done === false)
        })

        const stickerOpen = falseSticker.map(sticker => {
          return { _id: sticker._id, use: sticker.use, open: true}
        })

        if (checkMission) {
          User
            .findOneAndUpdate(
              { _id: req.decoded.userId, 'myMission.mission': missionId },
              { $set: { 'myMission.$.done': true }}
            )
            .then(() => {
              res.send({
                success: true,
                missionId: missionId,
                missionMessage: 'คุณได้ผ่านภารกิจการเปิดสติกเกอร์นักเตะครั้งแรก ได้รับรางวัลสติกเกอร์ 2 ใบ กดรับได้ทันที',
                message: 'เปิดสติกเกอร์เรียบร้อย',
                newSticker: stickerOpen,
                amount: stickerOpen.length
              })
            })
        } else {
          res.send({
            success: true,
            newSticker: stickerOpen,
            amount: stickerOpen.length
          })
        }
      })
      .catch(e => res.status(400).send({success: false, message: 'พบความผิดพลาด'}))
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

// router.get("/myStickerTeam/:teamId", authenticatePhone, (req, res) => {
//   const teamId = req.params.teamId

//   User
//     .findOne({ _id: req.decoded.userId })
//     .populate({path: 'mySticker.sticker', populate: {path: 'playerId'}})
//     .then(data => {
//       const myStickerTeam = data.mySticker.filter(sticker => sticker.sticker.playerId.team == teamId)
//       res.send({userTeamSticker: myStickerTeam})
//     })
// })

router.get("/myStickerPlayer/:playerId", authenticatePhone, (req, res) => {
  const playerId = req.params.playerId

  User
    .findOne({ _id: req.decoded.userId, 'mySticker.use': true })
    .populate('mySticker.sticker')
    .then(data => {
      const filterPlayerMySticker = data.mySticker.filter(sticker => {
        return sticker.sticker.playerId.toString() === playerId
      })

      let userPlayerSticker = new Array(8)

      filterPlayerMySticker.forEach(sticker => {
        let position = +sticker.sticker.stickerImage.substr(-5, 1);
        userPlayerSticker[position-1] = {sticker: true, stickerName: sticker.sticker.stickerImage}
      })

      res.send(userPlayerSticker)
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
                mySticker: { sticker: sticker[0]._id }
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

router.patch("/getPlayerPoint", authenticatePhone, (req, res) => {
  User
    .findOneAndUpdate(
      { _id: req.decoded.userId },
      { $inc: { manpoint: 1 }}
    )
    .then(data => {
      res.send({
        success: true,
        message: "คุณได้รับ Player point จำนวน 1 แต้มแล้ว"
      })
    })
    .catch(e => res.status(400).send({ success: false, message: 'พบความผิพพลาด' }))
})

router.patch("/usedSticker", authenticatePhone, (req, res) => {
  let stickerBtnId = req.body.stickerBtnId

  User.findOneAndUpdate(
    { _id: req.decoded.userId, mySticker: { $elemMatch: { sticker: stickerBtnId,  use: false }} }, 
    { $set: { 'mySticker.$.use': true }} 
  )
  .then(data => {
    res.send({
      success: true,
      message: "คุณใช้สติกเกอร์แล้ว"
    })
  })
  .catch(e => res.status(400).send({ success: false, message: 'พบความผิพพลาด' }))
})



module.exports = router