const { v4: uuidv4 } = require('uuid')

module.exports = function genPassword() {
  // 格式如 5e79b94b-548a-444a-943a-8a09377e3744
  const s = uuidv4()
  return s.split('-')[0]
}
