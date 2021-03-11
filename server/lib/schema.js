const joi = require('joi')

module.exports = {
  address: joi.string().required(),
  topics: joi.array().items(joi.string().required()).required(),
  channelType: joi.string().allow('SMS', 'EMAIL', 'VOICE').required()
}
