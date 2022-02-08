const { ErrorRes, SuccessRes } = require('../../res-model')
const {
  deleteWorkDbErrorFailInfo,
  deleteWorkFailInfo,
} = require('../../res-model/failInfo/works')
const { updateWorkService } = require('../../service/works')

/**
 * 删除作品
 * @param {string} id id
 * @param {string} author 作者
 * @param {boolean} putBack 是否撤回删除，默认值 false
 * @returns
 */
async function deleteWork(id, author, putBack = false) {
  let res
  try {
    // 假删除，更新作品 status
    const status = putBack ? 1 : 0
    res = await updateWorkService(
      {
        status,
      },
      {
        id,
        author,
      }
    )
  } catch (error) {
    console.error('删除作品错误', error)
    // 数据库错误
    return new ErrorRes(deleteWorkDbErrorFailInfo)
  }

  // 删除成功
  if (res) return new SuccessRes()

  // 删除失败
  return new ErrorRes(deleteWorkFailInfo, 'id 或 author 不匹配')
}

/**
 * 恢复删除
 * @param {string} id id
 * @param {string} author 作者
 * @returns
 */
async function putBackWork(id, author) {
  const res = await deleteWork(id, author, true)
  return res
}

module.exports = {
  deleteWork,
  putBackWork,
}
