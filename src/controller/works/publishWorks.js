const { publishWorkClearCache } = require('../../cache/works/publish')
const { h5Origin } = require('../../config')
const { ErrorRes, SuccessRes } = require('../../res-model')
const {
  publishWorkFailInfo,
  forceOffLineFailInfo,
  publishWorkDbErrorFailInfo,
} = require('../../res-model/failInfo/works')
const {
  findOneWorkService,
  updateWorkService,
  updatePublishContentService,
} = require('../../service/works')

/**
 * 发布作品/模板
 * @param {string} id 作品 id
 * @param {string} author 作者
 * @param {boolean} isTemplate 是否发布为模板，默认是 false
 */
async function publishWork(id, author, isTemplate = false) {
  const work = await findOneWorkService({ id, author })
  if (work === null) return new ErrorRes(publishWorkFailInfo, 'id 或作者不匹配')

  // 是否强制下线
  if (parseInt(work.status, 10) === 3) return new ErrorRes(forceOffLineFailInfo)

  // 发布，需要更数据
  const updateData = {
    status: 2,
    latestPulishAt: new Date(),
  }
  if (isTemplate) {
    Object.assign(updateData, { isTemplate })
  }

  let result
  try {
    // 更新发布的内容 - mongodb
    const publishContentId = await updatePublishContentService(
      work.content,
      work.publishContentId
    )

    // 发布项目 - mysql
    result = await updateWorkService(
      {
        publishContentId,
        ...updateData,
      },
      {
        id,
        author,
      }
    )
  } catch (error) {
    console.error('发布作品错误', id, error)
    return ErrorRes(publishWorkDbErrorFailInfo)
  }

  if (!result) return new ErrorRes(publishWorkFailInfo)

  // 重新发布，清空缓存
  publishWorkClearCache(id)

  // 发布成功，返回链接
  // 注意：uuid 是 4 位的，有重复的可能性，再 id 拼上，保证唯一性，且可以防爬虫(uuid)
  const url = `${h5Origin}/p/${work.id}-${work.uuid}`
  return new SuccessRes({ url })
}

module.exports = {
  publishWork,
}
