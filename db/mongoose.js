const mongoose = require('mongoose');
const config = require('./../config/config');

mongoose.Promise = global.Promise
mongoose.connect(config.mLab, { useMongoClient: true })

module.exports = {mongoose}