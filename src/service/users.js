const _ = require('lodash')
const UserModel = require('../models/UserModel')

/**
 * 查找用户信息
 * @param {*} param0
 * @returns
 */
async function findOneUserService({ username, password, phoneNumber }) {
  // 拼接查询条件
  let whereOpt = {}
  if (username) {
    Object.assign(whereOpt, { username })
  }
  if (password) {
    Object.assign(whereOpt, { username, password })
  }
  if (phoneNumber) {
    Object.assign(whereOpt, { phoneNumber })
  }

  // 无查询条件，则返回空
  if (_.isEmpty(whereOpt)) return null

  const result = await UserModel.findOne({
    where: whereOpt,
  })

  if (result === null) {
    return result
  }

  return result.dataValues
}

/**
 *
 * @param {object} data 用户信息，要符合 UserModel 的属性
 * @returns
 */
async function createUserService(data = {}) {
  const result = await UserModel.create(data)
  return result.dataValues
}

/**
 * 修改用户信息
 * @param {string} username username
 * @param {object} data 用户信息，要符合 UserModel 的属性
 * @returns {boolean} true | false
 */
async function updateUserInfoService(username, data = {}) {
  if (!username) return false
  if (_.isEmpty(data)) return false
  const result = await UserModel.update(data, {
    where: { username },
  })
  return result[0] !== 0
}

module.exports = {
  findOneUserService,
  createUserService,
  updateUserInfoService,
}
