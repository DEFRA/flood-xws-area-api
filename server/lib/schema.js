const joi = require('joi')

module.exports = {
  coord: joi.string(),
  bbox: joi.string(),
  type: joi.string().allow('faa', 'fwa').required()
}
