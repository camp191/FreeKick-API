const express = require('express')
const router = express.Router()
const { ObjectID } = require('mongodb')
const { authenticatePhone } = require('./../middleware/authenticate')

const { Mission } = require('./../models/mission')
const { User } =  require('./../models/user')

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

router.patch("/getReward/:missionId", authenticatePhone, (req, res) => {
  
})

module.exports = router