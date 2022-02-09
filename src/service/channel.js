const _ = require('lodash')
const { Op } = require('sequelize')
const ChannelModel = require('../models/ChannelModel')

/**
 * 创建渠道
 * @param {object} data 渠道数据
 * @returns
 */
async function createChannelService(data = {}) {
  const newChannel = await ChannelModel.create(data)
  return newChannel.dataValues
}

/**
 * 更新渠道
 * @param {object} data 待更新的渠道数据
 * @param {object} whereOpt 查询条件
 * @returns
 */
async function updateChannelService(data = {}, whereOpt = {}) {
  if (_.isEmpty(whereOpt)) return false
  if (_.isEmpty(data)) return false

  const result = await ChannelModel.update(data, {
    where: whereOpt,
  })

  return result[0] !== 0
}

/**
 * 获取渠道列表
 * @param {object} whereOpt 查询条件
 * @returns
 */
async function findChannelService(whereOpt = {}) {
  // 屏蔽掉删除的
  if (whereOpt.status == null) {
    Object.assign(whereOpt, {
      status: {
        [Op.ne]: 0,
      },
    })
  }

  const result = await ChannelModel.findAndCountAll({
    order: [
      ['id', 'desc'], // 倒序
    ],
    where: whereOpt,
  })

  const list = result.rows.map((row) => row.dataValues)

  return {
    count: result.count,
    list,
  }
}

module.exports = {
  createChannelService,
  updateChannelService,
  findChannelService,
}
