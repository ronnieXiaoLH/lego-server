const router = require('koa-router')()
const loginByPhoneNumber = require('../controller/users/loginByPhoneNumber')
const sendVericode = require('../controller/users/sendVericode')
const updateUserInfo = require('../controller/users/updateUserInfo')
const genValidator = require('../middleware/genValidator')
const loginCheck = require('../middleware/loginCheck')
const { SuccessRes } = require('../res-model')
const {
  phoneNumberSchema,
  userInfoSchema,
  phoneNumberVeriCodeSchema,
} = require('../validator/users')

// 路由前缀
router.prefix('/api/users')

// 生成短信验证码
router.post('/getVericode', genValidator(phoneNumberSchema), async (ctx) => {
  const { phoneNumber, isRemoteTest } = ctx.request.body
  const res = await sendVericode(phoneNumber, isRemoteTest)
  ctx.body = res
})

// 使用手机号登录
router.post(
  '/loginByPhoneNumber',
  genValidator(phoneNumberVeriCodeSchema),
  async (ctx) => {
    const { phoneNumber, veriCode } = ctx.request.body
    const res = await loginByPhoneNumber(phoneNumber, veriCode)
    ctx.body = res
  }
)

// 获取用户信息
router.get('/getUserInfo', loginCheck, async (ctx) => {
  // 经过 loginCheck 中间件处理，ctx.userInfo 存储了用户信息
  ctx.body = new SuccessRes(ctx.userInfo)
})

// 更新用户信息
router.patch(
  '/updateUserInfo',
  loginCheck,
  genValidator(userInfoSchema),
  async (ctx) => {
    const res = await updateUserInfo(ctx.userInfo, ctx.request.body)
    ctx.body = res
  }
)

module.exports = router
