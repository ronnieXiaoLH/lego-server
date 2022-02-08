const _ = require('lodash')
const { Op } = require('sequelize')
const { WorkContentModel } = require('../models/WorkContentModel')
const WorksModel = require('../models/WorksModels')
const UserModel = require('../models/UserModel')

/**
 * 创建作品
 * @param {object} data 作品数据，按照 WorksModel 的属性规则
 * @param {object} content 作品内容
 * @returns
 */
async function createWorkService(data = {}, content = {}) {
  // 创建作品的内容 - mongoose
  const { components = [], props = {}, setting = {} } = content
  const newContent = await WorkContentModel.create({
    components,
    props,
    setting,
  })
  const { _id: contentId } = newContent

  // 创建作品记录 - mysql
  const newWork = await WorksModel.create({
    ...data,
    contentId: contentId.toString(),
  })
  return newWork.dataValues
}

/**
 * 查询作品
 * @param {object} whereOpt 查询条件
 * @returns
 */
async function findOneWorkService(whereOpt = {}) {
  // 无查询条件
  if (_.isEmpty(whereOpt)) return null

  const result = await WorksModel.findOne({
    where: whereOpt,
    include: [
      // 关联 User
      {
        model: UserModel,
        attributes: ['username', 'nickName', 'gender', 'picture'],
      },
    ],
  })

  if (result === null) return result

  const work = result.dataValues

  // 查询作品内容 - mongodb
  const { contentId } = work
  const content = await WorkContentModel.findById(contentId)

  // 返回查询结果
  return {
    ...work,
    content,
  }
}

/**
 * g更新作品数据
 * @param {object} data 更新的数据
 * @param {object} whereOpt 查询条件
 * @returns
 */
async function updateWorkService(data, whereOpt = {}) {
  if (_.isEmpty(data)) return false
  if (_.isEmpty(whereOpt)) return false

  // 判断要更新的数据是否存在
  const work = await findOneWorkService(whereOpt)
  if (work === null) return false

  // 要更新的数据
  const updateData = data

  // 更新 content - mongodb
  const { content } = updateData
  if (content) {
    // 更新 content
    const { contentId } = work
    await WorkContentModel.findByIdAndUpdate(contentId, {
      components: content.components || {},
      props: content.props || {},
      setting: content.props || {},
    })
  }

  // 删除不需要更新的属性
  delete updateData.id
  delete updateData.uuid
  delete updateData.content
  delete updateData.contentId

  if (_.isEmpty(updateData)) {
    // 至此，更新数据为空
    // 这也正常，例如用户只更新 content，content 是存储在 mongodb 的，不需要更新 mysql
    return true
  }

  // 更新作品数据 - mysql
  const result = await WorksModel.update(updateData, { where: whereOpt })
  return result[0] !== 0
}

/**
 * 查询作品列表
 * @param {object} whereOpt 查询条件
 * @param {object} pageOpt 分页信息
 */
async function findWorkListService(whereOpt = {}, pageOpt = {}) {
  // 拼接查询条件
  const wheres = {}

  // 1. 处理特殊查询条件
  const { title, status, isTemplate } = whereOpt
  if (title) {
    Object.assign(wheres, {
      title: {
        [Op.like]: `%${title}%`, // 模糊查询
      },
    })
  }
  delete whereOpt.title
  if (isTemplate != null) {
    Object.assign(wheres, {
      isTemplate: !!isTemplate,
    })
    delete whereOpt.isTemplate
  }
  const statusNum = parseInt(status, 10)
  // status 无要求，则屏蔽掉删除的
  if (isNaN(statusNum)) {
    Object.assign(wheres, {
      status: {
        [Op.ne]: 0,
      },
    })
  } else {
    Object.assign(wheres, {
      status: statusNum,
    })
  }
  delete whereOpt.status

  // 2. 拼接其他的查询条件
  _.forEach(whereOpt, (val, key) => {
    if (val == null) return
    wheres[key] = val
  })

  // 执行查询
  const { pageIndex, pageSize } = pageOpt
  const result = await WorksModel.findAndCountAll({
    limit: pageSize, // 每页多少条
    offset: pageSize * pageIndex, // 跳过多少条
    order: [
      ['orderIndex', 'desc'], // 倒序
      ['id', 'desc'], // 倒序。多个排序，按先后顺序确定优先级
    ],
    where: wheres,
    include: [
      // 关联 User
      {
        model: UserModel,
        attributes: ['username', 'nickName', 'gender', 'picture'],
      },
    ],
  })
  const list = result.rows.map((row) => row.dataValues)

  return {
    count: result.count,
    list,
  }
}

module.exports = {
  createWorkService,
  findOneWorkService,
  updateWorkService,
  findWorkListService,
}
