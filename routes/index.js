const express = require("express")
const router = express.Router()

const { Mission } = require("../models/mission")
const { Team } = require("../models/team")

router.get("/", function(req, res, next) {
  res.send({ res: "welcome to APIs" })
})

router.post("/", (req, res) => {
  let mission = new Mission({
    missionDesc: req.body.missionDesc,
    missionImage: req.body.missionImage,
    missionCondition: req.body.missionCondition,
    reward: req.body.reward
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

router.post("/team", (req, res) => {
  let team = new Team({
    teamName: req.body.teamName,
    teamImage: req.body.teamImage,
    mission: req.body.mission
  })

  team.save().then(
    data => {
      res.send({
        data,
        message: "team save done"
      })
    }
  )
})

router.get("/team", (req, res) => {
  Team.find().then((team) => {
      res.send({team})
  })
})

module.exports = router
