const redisClient = require('../db/redis')

/**
 *
 * @param {string} key
 * @param {string | object} val
 * @param {number} timeout 过期时间，单位为秒，默认值为 1h
 */
function cacheSet(key, val, timeout = 60 * 60) {
  let formatVal
  if (typeof val === 'object') {
    formatVal = JSON.stringify(val)
  } else {
    formatVal = val
  }
  redisClient.set(key, formatVal)
  redisClient.expire(key, timeout)
}

function cacheGet(key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        return reject(err)
      }
      if (val === null) {
        return resolve(val)
      }
      try {
        resolve(JSON.parse(val))
      } catch (error) {
        resolve(val)
      }
    })
  })
}

module.exports = {
  cacheGet,
  cacheSet,
}
