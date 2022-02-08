const {
  publicTemplateCacheGet,
  publicTemplateCacheSet,
} = require('../../cache/works/templates')
const { DEFAULT_PAGE_SIZE } = require('../../config/constant')
const { SuccessRes, ErrorRes } = require('../../res-model')
const {
  findOneWorkFailInfo,
  findOneWorkDbErrorFailInfo,
} = require('../../res-model/failInfo/works')
const {
  findWorkListService,
  findOneWorkService,
} = require('../../service/works')

function hidePhoneNumber(number = '') {
  const n = number.toString()
  if (!n) return n

  const reg = /^1[3456789]\d{9}$/
  if (!reg.test(n)) return n
  return n.slice(0, 3) + '****' + n.slice(-4)
}

function formatTemplate(template = {}) {
  if (Array.isArray(template)) {
    return template.map((item) => formatTemplate(item))
  }

  const result = template
  // 用户名若是手机号，则隐藏手机号
  result.author = hidePhoneNumber(result.author)
  if (result.user) {
    const user = result.user.dataValues
    user.username = hidePhoneNumber(user.username)
  }

  return result
}

/**
 * 查询公共模板
 * @param {object} queryInfo 查询条件
 * @param {oject} pageInfo 分页
 * @returns
 */
async function findPublicTemplate(queryInfo = {}, pageInfo = {}) {
  const tempaltesFromCache = await publicTemplateCacheGet(queryInfo, pageInfo)
  if (tempaltesFromCache != null) {
    return new SuccessRes(tempaltesFromCache)
  }

  const { id, uuid, title } = queryInfo
  let { pageIndex, pageSize } = pageInfo
  pageIndex = parseInt(pageIndex, 10) || 0
  pageSize = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE

  // 从数据库中获取
  const { list, count } = await findWorkListService(
    {
      id,
      uuid,
      title,
      isTemplate: true,
      isPublic: true,
    },
    {
      pageIndex,
      pageSize,
    }
  )

  // 格式化模板
  const formatList = formatTemplate(list)

  // 记录到缓存中
  publicTemplateCacheSet(queryInfo, pageInfo, { list: formatList, count })

  return new SuccessRes({
    list: formatList,
    count,
  })
}

async function findOneTemplate(id) {
  if (!id) return new ErrorRes(findOneWorkFailInfo, 'id 为空')

  let template
  try {
    template = await findOneWorkService({
      id,
      isTemplate: true,
      isPublic: true,
    })
  } catch (error) {
    console.error('查询单个模板', error)
    // 数据库错误
    return new ErrorRes(findOneWorkDbErrorFailInfo)
  }

  // 查询失败
  if (template === null) return new ErrorRes(findOneWorkFailInfo)

  template = formatTemplate(template)

  return new SuccessRes(template)
}

module.exports = {
  findPublicTemplate,
  findOneTemplate,
}
