const getEndpoint = require('./pinpoint/get-endpoint')

async function getSubscriptions (address, channelType) {
  return getEndpoint(address, channelType)
}

module.exports = getSubscriptions
