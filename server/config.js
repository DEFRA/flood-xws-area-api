require('dotenv').config()
const joi = require('joi')
const envs = ['local', 'development', 'test', 'production']

function getDatabaseUrl () {
  // conditional so as not to break existing code but also handle copilot created connection credentials
  // once all docker compose files are using process.env.DATABASE_CONNECTION then the conditional can be removed
  if (process.env.DATABASE_CONNECTION) {
    const { username, password, dbname, host, port } = JSON.parse(process.env.DATABASE_CONNECTION)
    return `postgres://${username}:${password}@${host}:${port}/${dbname}`
  } else {
    return process.env.DATABASE_URL
  }
}

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
  databaseUrl: getDatabaseUrl()
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
