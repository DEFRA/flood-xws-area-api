const joi = require('joi')

module.exports = {
  code: joi.string(),
  coord: joi.string(),
  bbox: joi.string(),
  type: joi.string().allow('faa', 'fwa').required()
}
