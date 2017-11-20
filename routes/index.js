const express = require("express")
const router = express.Router()
const fs = require('fs')
const { Mission } = require("../models/mission")
const { Team } = require("../models/team")
const { Player } = require("../models/player")

router.get("/", function(req, res, next) {
  res.send({ res: "welcome to FreeKick APIs" })
})

module.exports = router
