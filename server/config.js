require('dotenv').config()
const joi = require('joi')
const envs = ['local', 'development', 'test', 'production']

// Define config schema
const schema = joi.object().keys({
  env: joi.string().valid(...envs).default(envs[0]),
  host: joi.string().hostname().required(),
  port: joi.number().default(3000),
  databaseUrl: joi.string().uri().required()
})

const config = {
  env: process.env.ENV,
  host: process.env.HOST,
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL
}

// Validate config
const { error, value } = schema.validate(config)

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

// Add some helper props
value.isDev = value.env === 'dev'

module.exports = value
