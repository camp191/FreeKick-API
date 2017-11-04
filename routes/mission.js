const express = require('express')
const router = express.Router()

const { authenticatePhone } = require('./../middleware/authenticate')

const { Mission } = require('./../models/mission')

router.get('/:missionId', authenticatePhone, (req, res) => {
  const missionId = req.params.missionId
  Mission
    .findOne({ _id: missionId })
    .then(data => {
      res.send({mission: data})
    }, (e) => {
      res.status(400).send({ error: 'ไม่พบภารกิจที่ค้นหา' })
    })
})

module.exports = router