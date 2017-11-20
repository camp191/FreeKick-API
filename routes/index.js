const express = require("express")
const router = express.Router()

router.get("/", function(req, res, next) {
  res.send({ res: "welcome to FreeKick APIs" })
})

module.exports = router
