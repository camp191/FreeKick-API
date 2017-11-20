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
            const missionId = '59f75f1c7214b5998337d94f'
            const checkMission = data.myMission.find(mission => {
              return ((mission.mission).toString() === missionId) && (mission.done === false)
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
                    missionMessage: 'คุณได้ผ่านภารกิจการแลก Match ครั้งแรก ได้รับรางวัลสติกเกอร์ 3 ใบ กดรับได้ทันที',
                    message: 'แลก Match สำเร็จ',
                  })
                })
            } else {
              res.send({ success: true, message: 'แลก Match สำเร็จ' })
            }
          })
          .catch(e => res.status(400).send({ success: false, message: 'พบความผิดพลาดในการแลก' }))
      }
    })
    .catch(e => res.status(400).send({ success: false, message: 'พบความผิดพลาด' }))
})
 
router.get('/myMatch', authenticatePhone, (req, res) => { 
  User
    .findOne({ _id: req.decoded.userId })
    .populate('myMatch.match')
    .then(data => {
      const myMatches = data.myMatch
      if (myMatches.length == 0) {
        res.send({ mainmessage: 'คุณไม่มี Match' , submessage :'หากคุณมีคะแนนมากกว่า 1 คุณจะสามารถแลก Match ได้' })
      } else {
        res.send(myMatches) 
      }
    })
    .catch(e => res.status(400).send({ success: false, message: 'พบความผิดพลาด' }))
})

router.get('/myHistoryMatch', authenticatePhone, (req, res) => {
  User
    .findOne({ _id: req.decoded.userId })
    .populate('myMatch.match')
    .then(data => {
      const filterWatch = data.myMatch.filter(match => {
        return match.watch === true
      })

      res.send({
        success: true,
        historyMatch: filterWatch
      })
    })
    .catch(e => res.status(400).send({ success: false, message: 'พบความผิดพลาด' }))
})

router.get('/videos/:videoId/:matchId', authenticatePhone, (req, res) => {
  const videoId = req.params.videoId
  const matchId = req.params.matchId

  User
    .findOneAndUpdate(
      { _id: req.decoded.userId, 'myMatch.match': matchId },
      { $set: { 'myMatch.$.watch': true }}
    )
    .then(data => {
      res.send({
        success: true,
        videoLink: `http://localhost:3000/videos/SampleVideo${+videoId}.mp4`
      })
    })
    .catch(e => {
      res.send({
        success: false,
        message: 'พบความผิดพลาดในการเล่นวิดิโอ'
      })
    })
})


module.exports = router