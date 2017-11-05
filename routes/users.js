const jwt = require('jsonwebtoken')
const express = require('express')
const bycrypt = require('bcrypt')
const { ObjectID } = require('mongodb')

const router = express.Router()

const { authenticatePhone } = require('./../middleware/authenticate')
const { secret } = require('./../config/config')

const { User } = require('./../models/user')
const { Sticker } = require('./../models/sticker')
const { Mission } = require('./../models/mission')

router.post('/addUser', (req, res) => {
  let myMission = [];
  const password = req.body.password
  
  Mission
    .find()
    .exec((err, data) => {
      data.map((mission) => {
        myMission.push({mission, done: false})
      })
    })
    .then(() => {
      bycrypt.hash(password, 10)
      .then(hash => {
        let user = new User({
          auth: {
            phone: {
              phoneNumber: req.body.phoneNumber, 
              name: req.body.name,
              username: req.body.username,
              password: hash
            }
          },
          myTeam: [],
          myMission,
          sticker: [],
          sticker: [],
          myMatch: [],
        })
      
        user
          .save()
          .then(
            data => {
              const payload = {userId: user._id}
              const token = jwt.sign(payload, secret)

              res.send({
                success: true,
                response: "สมัครสมาชิกเรียบร้อย",
                token
              })
            }
          )
          .catch(e => res.send({ success: false, message: 'เบอร์นี้ใช้สมัครแล้ว'}))
      })
    })
    .catch(e => res.status(400).send({success: false, message: 'พบความผิดพลาด'}))
})

router.post('/login', (req, res) => {
  User
  .findOne({ 'auth.phone.phoneNumber': req.body.phoneNumber })
  .then((user) => {
    if(!user) {
      res.json({ success: false, message: 'เบอร์โทรไม่ถูกต้อง' })
    } else if (user) {
        bycrypt
          .compare(req.body.password, user.auth.phone.password)
          .then((hashresult) => {
            if (!hashresult) {
              res.json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' })
            } else {
              const payload = {userId: user._id}
              const token = jwt.sign(payload, secret)
      
              res.json({
                success: true,
                message: 'เข้าสู่ระบบเรียบร้อยแล้ว',
                token: token
              })
            }
          })
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
      res.send({
        success: true,
        myMission: data.myMission
      })
    })
    .catch(e => {
      res.status(400).send({ success: false, message: 'พบความผิดพลาด' })
    })
})

router.get('/userdata', authenticatePhone, (req, res) => {
  User
    .findOne({ _id: req.decoded.userId })
    .then(data => {
      res.send({
        success: true,
        username: data.auth.phone.username,
        manpoint: data.manpoint,
        matchpoint: data.matchpoint,
        sticker: data.sticker.length
      })
    })
    .catch(e => res.status(400).send({ success: false, message: 'พบความผิดพลาด' }))
})

router.get('/myTeam', authenticatePhone, (req, res) => {
  User
    .findOne({ _id: req.decoded.userId })
    .populate({ path: 'myTeam', populate: { path: 'player' }})
    .then(data => {
      res.send({
        success: true,
        myTeam: data.myTeam
      })
    })
    .catch(e => res.statue(400).send({ success: false, message: 'พบความผิดพลาด' }))
})

module.exports = router
