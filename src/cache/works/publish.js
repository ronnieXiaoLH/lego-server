const { cacheSet } = require('..')

const PREFIX = 'publishWorkId-'

/**
 * 发布作品，缓存失效
 * @param {string} id 作品 id
 */
function publishWorkClearCache(id) {
  const key = `${PREFIX}${id}`
  cacheSet(key, '')
}

module.exports = {
  publishWorkClearCache,
}
