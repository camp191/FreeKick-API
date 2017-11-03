const express = require('express')
const router = express.Router()

const { User } = require('./../models/user')
const { Sticker } = require('./../models/sticker')
const { Mission } = require('./../models/mission')


let missions = []
  Mission.find().then(data => {
    data.map((mission) => {
      missions.append({
        mission: mission._id,
        done: false
      })
    })
  })

  console.log(missions)

router.post('/addUser', (req, res) => {

  let user = new User({
    auth: [],
    myTeam: req.body.myTeam,
    myMission: [mission],
    sticker: [],
    sticker: [],
    myMatch: [],
  })

  user.save().then(
    data => {
      res.send({
        response: "สมัครสมาชิกเรียบร้อย",
        userid: data._id
      })
    }
  )
})

router.get('/', (req, res) => {
  User
    .find()
    .populate('myMission.mission')
    .then(data => {
      res.send({data})
    })
})

router.get('/userPoint/:id', (req, res) => {
  let id = req.params.id

  User
    .findOne({ _id: id })
    .then(data => {
      res.send({
        manpoint: data.manpoint,
        matchpoint: data.matchpoint,
        sticker: data.sticker.length
      })
    })
})

module.exports = router
