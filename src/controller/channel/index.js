const { ErrorRes, SuccessRes } = require('../../res-model')
const {
  createChannelFailInfo,
  createChannelDbErrorFailInfo,
  updateChannelFailInfo,
  updateChannelDbErrorFailInfo,
  findChannelListFailInfo,
} = require('../../res-model/failInfo')
const {
  createChannelService,
  updateChannelService,
  findChannelService,
} = require('../../service/channel')

/**
 * 创建渠道
 * @param {object} data 渠道数据
 * @returns
 */
async function createChannel(data = {}) {
  const { name, workId } = data
  if (!name || !workId)
    return new ErrorRes(createChannelFailInfo, '渠道名和作品 id 不能为空')

  let result
  try {
    result = await createChannelService(data)
  } catch (error) {
    console.error('创建渠道错误', error)
    return new ErrorRes(createChannelDbErrorFailInfo)
  }

  if (result == null) return new ErrorRes(createChannelFailInfo)
  return new SuccessRes(result)
}

/**
 * 更新渠道名称
 * @param {string} id id
 * @param {string} name 渠道名称
 * @returns
 */
async function updateChannelName(id, name) {
  if (!id || !name)
    return new ErrorRes(updateChannelFailInfo, 'id 和名称不能为空')

  let result
  try {
    result = await updateChannelService({ name }, { id })
  } catch (error) {
    console.error('更新渠道错误', error)
    return new ErrorRes(updateChannelDbErrorFailInfo)
  }

  if (!result) return new ErrorRes(updateChannelFailInfo)

  return new SuccessRes()
}

/**
 * 删除渠道
 * @param {string} id id
 */
async function deleteChannel(id) {
  if (!id) return new ErrorRes(updateChannelFailInfo, 'id 不能为空')

  let result
  try {
    result = await updateChannelService(
      {
        status: 0,
      },
      { id }
    )
  } catch (error) {
    console.error('删除渠道错误', error)
    return new ErrorRes(updateChannelDbErrorFailInfo)
  }

  if (!result) return new ErrorRes(updateChannelFailInfo)

  return new SuccessRes()
}

/**
 * 获取作品的渠道列表
 * @param {string} workId 作品 id
 */
async function getWorkChannels(workId) {
  if (!workId) return new ErrorRes(findChannelListFailInfo, '作品 id 不能为空')

  const result = await findChannelService({
    workId,
  })

  return new SuccessRes(result)
}

module.exports = {
  createChannel,
  updateChannelName,
  deleteChannel,
  getWorkChannels,
}
