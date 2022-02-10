const usersInfos = require('./users')
const validateInfo = require('./validate')
const channelInfos = require('./channel')
const utilsInfo = require('./utils')

module.exports = {
  ...usersInfos,
  ...validateInfo,
  ...channelInfos,
  ...utilsInfo,
}
