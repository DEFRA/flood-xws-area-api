require('dotenv').config()
const joi = require('joi')
const envs = ['sandbox', 'test', 'production']
const logLevels = ['debug', 'warn']

// Define config schema
const schema = joi.object().keys({
  env: joi.string().valid(...envs),
  host: joi.string().hostname().required(),
  port: joi.number().default(3002),
  databaseUrl: joi.string().uri().required(),
  databaseSsl: joi.boolean().required(),
  logLevel: joi.string().valid(...logLevels)
})

const config = {
  env: process.env.NODE_ENV,
  host: process.env.HOST,
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  databaseSsl: process.env.DATABASE_SSL || false,
  logLevel: process.env.LOG_LEVEL || 'warn'
}

// Validate config
const { error, value } = schema.validate(config)

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

module.exports = value
