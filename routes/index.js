const express = require("express")
const router = express.Router()

const { Mission } = require("../models/mission")

router.get("/", function(req, res, next) {
  res.send({ res: "welcome to APIs" })
})

// router.post("/", (req, res) => {
//   let mission = new Mission({
//     missionDesc: req.body.missionDesc,
//     missionImage: req.body.missionImage,
//     missionCondition: req.body.missionCondition,
//     reward: req.body.reward
//   })

//   mission.save().then(
//     data => {
//       res.send({
//         data,
//         message: "Save Done"
//       })
//     }
//   )
// })

module.exports = router
