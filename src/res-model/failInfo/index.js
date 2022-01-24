const usersInfos = require('./users')
const validateInfo = require('./validate')

module.exports = {
  ...usersInfos,
  ...validateInfo,
}
