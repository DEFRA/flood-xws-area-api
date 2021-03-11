const updateEndpoint = require('./pinpoint/update-endpoint')

async function updateSubscriptions (address, channelType, topics) {
  return updateEndpoint(address, channelType, topics)
}

module.exports = updateSubscriptions
