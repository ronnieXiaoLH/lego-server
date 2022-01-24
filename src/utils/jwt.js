const util = require('util')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/constant')
const { jwtExpiresIn } = require('../config')

const verify = util.promisify(jwt.verify)

/**
 * jwt verify
 * @param {string} token token
 * @returns
 */
async function jwtVerify(token) {
  // 去掉前面的 Bearar
  const data = await verify(token.split(' ')[1], JWT_SECRET)
  return data
}

/**
 * jwt sign
 * @param {object} data data
 * @returns
 */
function jwtSign(data) {
  const token = jwt.sign(data, JWT_SECRET, { expiresIn: jwtExpiresIn })
  return token
}

module.exports = {
  jwtVerify,
  jwtSign,
}
