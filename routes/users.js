const express = require('express')
const router = express.Router()

const { User } = require('./../models/user')
const { Sticker } = require('./../models/sticker')
const { Mission } = require('./../models/mission')

router.post('/addUser', (req, res) => {
  let myMission = [];
  
  Mission
    .find()
    .exec((err, data) => {
      data.map((mission) => {
        myMission.push({mission, done: false})
      })
    }).then(() => {
      let user = new User({
        auth: {
          phone: {
            phoneNumber: req.body.phoneNumber, 
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
          }
        },
        myTeam: [],
        myMission,
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
    }
    )
})

router.get('/myMission/:userId', (req, res) => {
  const userId = req.params.userId

  User
    .findOne({ _id: userId })
    .populate('myMission.mission')
    .then(data => {
      res.send(data.myMission)
    })
})

router.get('/userdata/:id', (req, res) => {
  let id = req.params.id

  User
    .findOne({ _id: id })
    .then(data => {
      res.send({
        username: data.auth.facebook.username,
        picture: data.auth.facebook.picture,
        manpoint: data.manpoint,
        matchpoint: data.matchpoint,
        sticker: data.sticker.length
      })
    })
})

module.exports = router
