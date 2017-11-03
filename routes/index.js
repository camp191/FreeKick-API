const express = require("express")
const router = express.Router()
const fs = require('fs')
const { Mission } = require("../models/mission")
const { Team } = require("../models/team")
const { Player } = require("../models/player")

router.get("/", function(req, res, next) {
  res.send({ res: "welcome to APIs" })
})

router.get("/sss", (req, res) => {

  Player
    .find({ age: 26 })
    .populate('team')
    .then((data) => {
      res.send({
        player: data
      })
    })
})

//  Send Picture
router.get("/file", (req, res) => {
  fs.readFile(__dirname + "/../public/images/a.png", function(err, data) {
    if (err) throw err;
    res.send({
      Hello: "Good",
      img: data
    })
  })
}) 

// router.post("/mission", (req, res) => {
//   let mission = new Mission({
//     missionDesc: "เปิด \"สติกเกอร์นักเตะ\" ครั้งแรกที่ท่านได้รับ รับสติกเกอร์เพิ่ม 2 ใบ",
//     missionImage: "mission1.jpg",
//     missionCondition: "",
//     reward: 2
//   })

//   mission.save().then(
//     data => {
//       res.send({data})
//     }
//   )
// })

router.post("/", (req, res) => {
  let mission = new Mission({
    missionDesc: req.body.missionDesc,
    missionImage: req.body.missionImage,
    missionCondition: req.body.missionCondition,
    reward: req.body.reward,
  })

  mission.save().then(
    data => {
      res.send({
        data,
        message: "Save Done"
      })
    }
  )
})

// router.post("/player", (req, res) => {
//   let player = new Player({
//     name: "David De Gia",
//     age: 26,
//     numberShirt: 1,
//     position: "GK",
//     preferredFoot: "Right",
//     dateOfBirth: new Date(1990, 11, 07),
//     nationality: "Spain",
//     height: 192,
//     description: "",
//     team: "59f71dfe789c6413f0dfe519",
//     sticker: []
//   })

//   player.save().then(
//     data => {
//       res.send({
//         data
//       })
//     }
//   )
// })

// router.get("/player", (req, res) => {
//   Player.find({ age: 24 })
//     // .populate('team')
//     .then(
//       data => {
//         res.send({data})
//       }
//     )
// })

// router.get("/team", (req, res) => {
//   Team.find()
//     .populate('player')
//     .then(
//       data => {
//         res.send({data})
//       }
//     )
// })

// router.post("/team", (req, res) => {
//   let team = new Team({
//     teamName: req.body.teamName,
//     teamImage: req.body.teamImage,
//     mission: req.body.mission
//   })

//   team.save().then(
//     data => {
//       res.send({
//         data,
//         message: "team save done"
//       })
//     }
//   )
// })

// router.get("/team", (req, res) => {
//   Team
//     .find()
//     .populate('mission')
//     .then(
//       data => {
//         res.send({
//           data
//         })
//       }
//     )
// })

module.exports = router
