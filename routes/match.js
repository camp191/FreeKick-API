const express = require('express')
const router = express.Router()
const { ObjectID } = require('mongodb')
const { authenticatePhone } = require('./../middleware/authenticate')

const { Match } = require('./../models/match')
const { User } = require('./../models/user')

router.get('/all', authenticatePhone, (req, res) => {
  Match
    .find()
    .then(data => {
      res.send({matches: data})
    }, (e) => {
      res.status(400).send({ success: false, message: 'พบความผิดพลาด'})
    })
})

router.get('/match/:matchId', authenticatePhone, (req, res) => {
  const matchId = req.params.matchId

  if(!ObjectID.isValid(matchId)) {
    return res.status(404).send({ success: false, message : 'ไม่พบ Match ที่ต้องการ'})
  }

  Match
    .findOne({ _id: matchId })
    .then(data => {
      User
        .findOne({ _id: req.decoded.userId })
        .then(userdata => {
          const checkMatch = userdata.myMatch.filter(match => {
            return match.match.toString() === matchId
          })

          if (checkMatch.length > 0) {
            res.send({ success: true, userGet: true, data })
          } else {
            res.send({ success: true, userGet: false, data })
          }
        })
    }, (e) => {
      res.status(400).send({ success: false, message: 'พบความผิดพลาด' })
    })
})

router.patch('/userGetMatch/:matchId', authenticatePhone, (req, res) => {
  const matchId = req.params.matchId

  User
    .findOne({ _id: req.decoded.userId })
    .then(data => {
      if (data.manpoint < 1) {
        res.send({success: false, message: "แต้มไม่เพียงพอในการแลก"})
      } else {
        User
          .findOneAndUpdate(
            { _id: req.decoded.userId },
            { $push: { myMatch: { match: matchId } }, $inc: { manpoint: -1 } },
            { new: true }
          )
          .then(data => {
            res.send({ success: true, message: 'แลก Match สำเร็จ' })
          })
          .catch(e => res.status(400).send({ success: false, message: 'พบความผิดพลาดในการแลก' }))
      }
    })
    .catch(e => res.status(400).send({ success: false, message: 'พบความผิดพลาด' }))
})
 
router.get('/myMatch', authenticatePhone, (req,res)=> { 
  User
    .findOne({ _id: req.decoded.userId })
    .populate('myMatch.match')
    .then(data => {
      var myMatches = data.myMatch
      if (myMatches.length == 0) {
        res.send({ mainmessage: 'คุณไม่มี Match' , submessage :'หากคุณมีคะแนนมากกว่า 1 คุณจะสามารถแลก Match ได้' })
      } else {
        res.send(myMatches) 
      }
    })
    .catch(e => res.status(400).send({ success: false, message: 'พบความผิดพลาด' }))
}) 



module.exports = router