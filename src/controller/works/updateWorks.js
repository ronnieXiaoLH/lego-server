const _ = require('lodash')
const { ErrorRes, SuccessRes } = require('../../res-model')
const {
  updateWorkFailInfo,
  updateWorkDbErrorFailInfo,
  transferWorkFailInfo,
} = require('../../res-model/failInfo/works')
const { findOneUserService } = require('../../service/users')
const { updateWorkService } = require('../../service/works')

/**
 * 修改作品
 * @param {string} id id
 * @param {string} author 作者 username
 * @param {object} data 作品数据
 * @returns
 */
async function updateWorks(id, author, data = {}) {
  if (!id || !author)
    return new ErrorRes(updateWorkFailInfo, 'id 或 author 不能为空')
  if (_.isEmpty(data))
    return new ErrorRes(updateWorkFailInfo, '更新数据不能为空')

  let res
  try {
    res = await updateWorkService(data, { id, author })
  } catch (error) {
    console.error('更新作品错误', id, error)
    // 数据库错误
    return new ErrorRes(updateWorkDbErrorFailInfo)
  }

  // 更新成功
  if (res) return new SuccessRes()
  // 更新失败
  return new ErrorRes(updateWorkFailInfo, 'id 或 author 不匹配')
}

/**
 * 转赠作品
 * @param {string} id id
 * @param {string} author 作者
 * @param {string} receiverUsername 接收人
 * @returns
 */
async function transferWorks(id, author, receiverUsername) {
  if (author === receiverUsername)
    return new ErrorRes(transferWorkFailInfo, '作者和接收人相同')

  // 判断接受者是否存在
  const receiver = await findOneUserService({
    username: receiverUsername,
  })
  if (receiver === null)
    return new ErrorRes(transferWorkFailInfo, '接收人未找到')

  const res = await updateWorks(id, author, {
    author: receiverUsername,
  })

  return res
}

module.exports = {
  updateWorks,
  transferWorks,
}
