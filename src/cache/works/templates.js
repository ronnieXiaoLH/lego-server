const { cacheGet, cacheSet } = require('..')
const { getSortedObjStr } = require('../../utils/util')

/**
 * 公共模板 - 缓存
 * @param {object} queryInfo 查询条件
 * @param {object} pageInfo 分页
 * @param {array} templates 模板数据
 * @returns
 */
async function publicTemplateCacheSet(
  queryInfo = {},
  pageInfo = {},
  templates
) {
  if (templates == null) return
  const key = getCacheKey(queryInfo, pageInfo)
  // timeout 设置为 1min，单位是 s
  cacheSet(key, templates, 60)
}

/**
 * 公共模板 - 获取
 * @param {object} queryInfo 查询条件
 * @param {oject} pageInfo 分页
 * @returns
 */
async function publicTemplateCacheGet(queryInfo = {}, pageInfo = {}) {
  const key = getCacheKey(queryInfo, pageInfo)
  const templates = await cacheGet(key)
  if (!templates) return null
  return templates
}

/**
 * 获取 key
 * @param {object} queryInfo 查询条件
 * @param {object} pageInfo 分页
 * @returns
 */
function getCacheKey(queryInfo = {}, pageInfo = {}) {
  const PREFIX = 'public-templates-'
  const queryInfoStr = getSortedObjStr(queryInfo)
  const pageInfoStr = getSortedObjStr(pageInfo)

  const key = `${PREFIX}${queryInfoStr}-${pageInfoStr}`
  return key
}

module.exports = {
  publicTemplateCacheGet,
  publicTemplateCacheSet,
}
