const express = require('express')
const router = express.Router()

const { Mission } = require('./../models/mission')

router.get('/', (req, res) => {
  Mission.find({})
})


module.exports = router