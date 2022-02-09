const usersInfos = require('./users')
const validateInfo = require('./validate')
const channelInfos = require('./channel')

module.exports = {
  ...usersInfos,
  ...validateInfo,
  ...channelInfos,
}
