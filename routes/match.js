const express = require('express')
const router = express.Router()
const { ObjectID } = require('mongodb')
const { authenticatePhone } = require('./../middleware/authenticate')

const { Match } = require('./../models/match')

router.get('/all', authenticatePhone, (req, res) => {
  Match
    .find()
    .then(data => {
      res.send({matches: data})
    }, (e) => {
      res.status(400).send({ success: false, message: 'พบความผิดพลาด'})
    })
})

router.get('/:matchId', authenticatePhone, (req, res) => {
  const matchId = req.params.matchId

  if(!ObjectID.isValid(matchId)) {
    return res.status(404).send({ success: false, message : 'ไม่พบ Match ที่ต้องการ'})
  }

  Match
    .findOne({ _id: matchId })
    .then(data => {
      res.send({match: data})
    }, (e) => {
      res.status(400).send({ success: false, message: 'พบความผิดพลาด' })
    })
})

module.exports = router