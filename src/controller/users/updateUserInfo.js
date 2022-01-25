const { ErrorRes, SuccessRes } = require('../../res-model')
const {
  updateUserInfoDbErrorFailInfo,
  updateUserInfoFailInfo,
} = require('../../res-model/failInfo')
const { updateUserInfoService } = require('../../service/users')
const { jwtSign } = require('../../utils/jwt')

async function updateUserInfo(curUserInfo, data = {}) {
  const { username } = curUserInfo
  let res
  try {
    res = await updateUserInfoService(username, data)
  } catch (error) {
    console.error('修改用户信息', error)
    // 数据库操作失败
    return new ErrorRes(updateUserInfoDbErrorFailInfo)
  }

  // 修改成功
  if (res) {
    const newUserInfo = {
      ...curUserInfo,
      ...data,
    }
    delete newUserInfo.iat
    delete newUserInfo.exp
    // 更新 token，因为 token 存储的是用户信息，需要更新用户信息
    return new SuccessRes({
      token: jwtSign(newUserInfo),
    })
  }

  // 修改失败
  return new ErrorRes(updateUserInfoFailInfo) // 失败，但数据库操作正确
}

module.exports = updateUserInfo
