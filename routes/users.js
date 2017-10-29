var express = require('express')
var router = express.Router()

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({
    aaa: "hello",
    ggg: "good"
  })
})

module.exports = router
