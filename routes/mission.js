const express = require('express')
const router = express.Router()
const { ObjectID } = require('mongodb')
const { authenticatePhone } = require('./../middleware/authenticate')

const { Mission } = require('./../models/mission')

router.get('/:missionId', authenticatePhone, (req, res) => {
  const missionId = req.params.missionId

  if(!ObjectID.isValid(missionId)) {
    return res.status(404).send({ success: false, message: 'ไม่พบภารกิจที่ต้องการ' })
  }

  Mission
    .findOne({ _id: missionId })
    .then(data => {
      res.send({mission: data})
    }, (e) => {
      res.status(400).send({ success: false, message: 'พบความผิดพลาด' })
    })
})

module.exports = router