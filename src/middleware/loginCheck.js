const { ErrorRes } = require('../res-model')
const { loginCheckFailInfo } = require('../res-model/failInfo')
const { jwtVerify } = require('../utils/jwt')

module.exports = async function loginCheck(ctx, next) {
  // 失败信息
  const errorRes = new ErrorRes(loginCheckFailInfo)

  const token = ctx.headers.authorization
  if (!token) {
    ctx.body = errorRes
    return
  }

  let flag = true
  try {
    const userInfo = await jwtVerify(token)
    // 屏蔽密码
    delete userInfo.password
    ctx.userInfo = userInfo
  } catch (error) {
    flag = false
    ctx.body = errorRes
  }

  if (flag) {
    await next()
  }
}
