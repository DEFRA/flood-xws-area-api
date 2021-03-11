const deleteEndpoint = require('./pinpoint/delete-endpoint')

async function deleteSubscriptions (address, channelType) {
  return deleteEndpoint(address, channelType)
}

module.exports = deleteSubscriptions
