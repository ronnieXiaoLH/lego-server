const { cacheGet, cacheSet } = require('../index')

// cache key 前缀，重要！！！否则数据容易混乱
const PREFIX = 'phoneVericode-'

/**
 * 从缓存获取验证码
 * @param {string} phoneNumber 手机号
 * @returns
 */
async function getVericodeFromCache(phoneNumber) {
  const key = `${PREFIX}${phoneNumber}`
  const code = await cacheGet(key)
  if (code === null) return code
  return code.toString()
}

/**
 *
 * @param {string} phoneNumber 手机号
 * @param {*} vericode 验证码
 * @param {*} timeout timeout 单位s
 */
async function setVericodeToCache(phoneNumber, vericode, timeout) {
  const key = `${PREFIX}${phoneNumber}`
  cacheSet(key, vericode, timeout)
}

module.exports = {
  getVericodeFromCache,
  setVericodeToCache,
}
