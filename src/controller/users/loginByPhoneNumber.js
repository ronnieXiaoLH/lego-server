const { getVericodeFromCache } = require('../../cache/users/veriCode')
const { ErrorRes, SuccessRes } = require('../../res-model')
const {
  loginVericodeIncorrectFailInfo,
  userFrozenFailInfo,
  createUserDbErrorFailInfo,
} = require('../../res-model/failInfo')
const {
  findOneUserService,
  updateUserInfoService,
  createUserService,
} = require('../../service/users')
const doCrypto = require('../../utils/cryp')
const genPassword = require('../../utils/genPassword')
const { jwtSign } = require('../../utils/jwt')

async function loginByPhoneNumber(phoneNumber, veriCode) {
  const vericodeFormCache = await getVericodeFromCache(phoneNumber)
  if (veriCode !== vericodeFormCache) {
    // 验证码不正确
    return new ErrorRes(loginVericodeIncorrectFailInfo)
  }

  const userInfo = await findOneUserService({
    phoneNumber,
  })
  if (userInfo) {
    // 判断用户是否冻结
    if (userInfo.isFrozen) return new ErrorRes(userFrozenFailInfo)

    // 更新最后登录时间
    try {
      await updateUserInfoService(userInfo.username, {
        latestLoginAt: new Date(),
      })
    } catch (error) {
      // 只记录错误，不是主要错误，不影响登录逻辑
      console.error('更新最后登录时间错误', error)
    }

    // 返回登录成功信息
    return new SuccessRes({
      token: jwtSign(userInfo),
    })
  }

  // 找不到，初次登录，创建用户
  let password = genPassword() // 随机创建一个密码
  password = doCrypto(password)

  try {
    const newUser = await createUserService({
      username: phoneNumber,
      password,
      phoneNumber,
      nickName: `乐高${phoneNumber.slice(-4)}`,
      latestLoginAt: new Date(),
    })
    return new SuccessRes({
      token: jwtSign(newUser),
    })
  } catch (error) {
    console.log('创建用户失败', error)
    return new ErrorRes(createUserDbErrorFailInfo)
  }
}

module.exports = loginByPhoneNumber
