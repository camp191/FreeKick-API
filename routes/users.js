const jwt = require('jsonwebtoken')
const { ObjectID } = require('mongodb')
const express = require('express')

const router = express.Router()

const { authenticatePhone } = require('./../middleware/authenticate')
const { secret } = require('./../config/config')

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

router.post('/login', (req, res) => {
  User
    .findOne({ 'auth.phone.phoneNumber': req.body.phoneNumber })
    .then((user) => {
      if(!user) {
        res.json({ success: false, message: 'เบอร์โทรไม่ถูกต้อง' })
      } else if (user) {
        if (user.auth.phone.password !== req.body.password) {
          res.json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' })
        } else {
          const payload = {userId: user._id}
          const token = jwt.sign(payload, secret)
  
          res.json({
            success: true,
            message: 'เข้าสู่ระบบเรียบร้อยแล้ว',
            token: token
          });
        }
      }
    }, (e) => {
      if(e) throw e
    })
})

router.patch('/addTeam/:teamId', authenticatePhone, (req, res) => {
  const teamId = req.params.teamId

  if(!ObjectID.isValid(teamId)) {
    return res.status(404).send({ error: 'id ของทีมผิดพลาด'})
  }

  User
    .findOneAndUpdate({ _id: req.decoded.userId }, { $push: { myTeam: teamId }})
    .then(data => {
      res.send({ success: true, message: 'อัพเดททีมเรียบร้อย'})
    })
    .catch((e) => {
      res.status(400).send(e)
    })
})

router.get('/myMission', authenticatePhone, (req, res) => {
  User
    .findOne({ _id: req.decoded.userId })
    .populate('myMission.mission')
    .then(data => {
      res.send(data.myMission)
    })
})

router.get('/userdata', authenticatePhone, (req, res) => {
  User
    .findOne({ _id: req.decoded.userId })
    .then(data => {
      res.send({
        username: data.auth.phone.username,
        manpoint: data.manpoint,
        matchpoint: data.matchpoint,
        sticker: data.sticker.length
      })
    })
})

module.exports = router
