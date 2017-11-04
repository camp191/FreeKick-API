const jwt = require('jsonwebtoken')
const { secret } = require('./../config/config')

let authenticatePhone = (req, res, next) => {
  let token = req.headers['x-token']

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.json({ success: false, message: 'พบการผิดพลาดในการยืนยันตัวตน' })
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res.status(403).send({ success: false, message: 'ไม่พบ Token ยืนยันตัวตน'})
  }
}

module.exports = { authenticatePhone }