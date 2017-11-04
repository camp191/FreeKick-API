const express = require('express')
const router = express.Router()

const { Mission } = require('./../models/mission')

router.get('/:missionId', (req, res) => {
  const missionId = req.params.missionId
  Mission
    .findOne({ _id: missionId })
    .then(data => {
      res.send({mission: data})
    })
})

module.exports = router