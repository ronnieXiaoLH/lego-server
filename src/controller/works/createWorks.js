const { v4: uuidv4 } = require('uuid')
const { ErrorRes, SuccessRes } = require('../../res-model')
const {
  createWorksFailInfo,
  createWorksDbErrorFailInfo,
  forceOffLineFailInfo,
} = require('../../res-model/failInfo/works')
const {
  createWorkService,
  findOneWorkService,
  updateWorkService,
} = require('../../service/works')

/**
 * 创建作品
 * @param {string} author 作者
 * @param {object} data 作品基本信息
 * @param {object} content 作品具体信息
 * @returns
 */
async function createWorks(author, data = {}, content = {}) {
  const { title } = data
  if (!title) {
    return new ErrorRes(createWorksFailInfo, '标题不能为空')
  }

  const uuid = uuidv4().slice(0, 4)
  try {
    const newWork = await createWorkService(
      {
        ...data,
        author,
        uuid,
      },
      content
    )
    return new SuccessRes(newWork)
  } catch (error) {
    console.error('创建作品失败', error)
    return new ErrorRes(createWorksDbErrorFailInfo)
  }
}

/**
 * 复制作品
 * @param {string} id id
 * @param {string} author 作者
 * @returns
 */
async function copyWorks(id, author) {
  // 被复制的项目不一定是自己的，所以查询条件不要加 author
  const work = await findOneWorkService({ id })

  // 判断作品是否被强制下线
  if (parseInt(work.status, 10) === 3) return new ErrorRes(forceOffLineFailInfo)

  const { content } = work

  const newData = {
    title: `${work.title}-复制`,
    desc: work.desc,
    coverImg: work.coverImg,
    // 其他信息，如 isTemplate status 等，都不需要
  }

  // 创建新项目
  const res = await createWorks(author, newData, content)

  // 更新原项目的使用次数
  await updateWorkService(
    {
      copiedCount: work.copiedCount + 1,
    },
    { id }
  )

  // 返回新项目
  return res
}

module.exports = {
  createWorks,
  copyWorks,
}
