const express = require('express')
const router = express.Router()
const { ObjectID } = require('mongodb')
const { authenticatePhone } = require('./../middleware/authenticate')

const { Mission } = require('./../models/mission')
const { User } =  require('./../models/user')
const { Sticker } = require('./../models/sticker')

// Query a Mission By Id
router.get('/mission/:missionId', authenticatePhone, (req, res) => {
  const missionId = req.params.missionId

  if(!ObjectID.isValid(missionId)) {
    return res.status(404).send({ success: false, message: 'ไม่พบภารกิจที่ต้องการ' })
  }

  Mission
    .findOne({ _id: missionId })
    .then(data => {
      res.send({
        success: true,
        mission: data
      })
    }, (e) => {
      res.status(400).send({ success: false, message: 'พบความผิดพลาด' })
    })
})

// Get User Mission
router.get('/myMission', authenticatePhone, (req, res) => {
  User
    .findOne({ _id: req.decoded.userId })
    .populate('myMission.mission')
    .then(data => {
      const MissionNotDone = data.myMission.filter(mission => {
        return mission.done === false
      })

      if (MissionNotDone.length === 0) {
        res.send({
          success: true,
          data: [],
          message: 'คุณทำภารกิจทั้งหมดแล้ว'
        })
      } else {
        res.send({
          success: true,
          data: data.myMission
        })
      }
    })
    .catch(e => {
      res.status(400).send({ success: false, message: 'พบความผิดพลาด' })
    })
})

// Get reward from Mission
router.patch("/getReward/:missionId", authenticatePhone, (req, res) => {
  const missionId = req.params.missionId
  let amountSticker = 0

  if (missionId === '59f75e424837d11fdfee35a0') {
    amountSticker = 2
  } else if (missionId === '59f75ed47214b5998337d0cc' || missionId === '59f75ef47214b5998337d51f') {
    amountSticker = 10
  } else if (missionId === '59f75f1c7214b5998337d94f') {
    amountSticker = 3
  }

  Sticker
    .findRandom({}, {}, {limit: amountSticker}, function(err, sticker) {
      const updateSticker = sticker.map(sticker => 
        User
          .findOneAndUpdate(
            { _id: req.decoded.userId },
            { $push: { 
              mySticker: { sticker: sticker._id }
            }}
          )
          .then(data => {
            return data
          })
      )
      
      Promise.all(updateSticker)
        .then(() => {
          const message = `คุณได้รับรางวัลภารกิจเป็นสติกเกอร์ใหม่จำนวน ${amountSticker} ชิ้น`
    
          res.send({
            success: true,
            message,
            dataSticker: sticker
          })
        })
        .catch(e => res.status(400).send({ success: false, message: 'พบความผิดพลาด' }))
    })
})

module.exports = router