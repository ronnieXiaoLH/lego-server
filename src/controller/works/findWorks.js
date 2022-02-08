const { DEFAULT_PAGE_SIZE } = require('../../config/constant')
const { ErrorRes, SuccessRes } = require('../../res-model')
const {
  findOneWorkFailInfo,
  findOneWorkDbErrorFailInfo,
} = require('../../res-model/failInfo/works')
const {
  findOneWorkService,
  findWorkListService,
} = require('../../service/works')

/**
 * 查询单个作品
 * @param {string} id id
 * @param {string} author 作者 username
 * @returns
 */
async function findOneWork(id, author) {
  if (!id || !author)
    return new ErrorRes(findOneWorkFailInfo, 'id 或 author 为空')

  let work
  try {
    work = await findOneWorkService({
      id,
      author,
    })
  } catch (error) {
    console.error('查询单个作品', error)
    // 数据库错误
    return new ErrorRes(findOneWorkDbErrorFailInfo)
  }

  // 查询失败，没有查询到作品
  if (work === null)
    return new ErrorRes(findOneWorkFailInfo, 'id 或 author 不匹配')

  return new SuccessRes(work)
}

/**
 *
 * @param {string} author 作者
 * @param {objetc} queryInfo 查询条件
 * @param {object} pageInfo 分页信息
 * @returns
 */
async function findMyWorks(author, queryInfo = {}, pageInfo = {}) {
  const { id, uuid, title, status, isTemplate } = queryInfo
  let { pageIndex, pageSize } = pageInfo
  pageIndex = parseInt(pageIndex, 10) || 0
  pageSize = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE

  const { list, count } = await findWorkListService(
    {
      id,
      uuid,
      title,
      status,
      author,
      isTemplate: isTemplate === '1',
    },
    {
      pageIndex,
      pageSize,
    }
  )
  return new SuccessRes({
    list,
    count,
  })
}

module.exports = {
  findOneWork,
  findMyWorks,
}
