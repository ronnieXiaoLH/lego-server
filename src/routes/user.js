const router = require('koa-router')()
const loginByPhoneNumber = require('../controller/users/loginByPhoneNumber')
const sendVericode = require('../controller/users/sendVericode')
const genValidator = require('../middleware/genValidator')
const { phoneNumberSchema, userInfoSchema } = require('../validator/users')

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
  genValidator(userInfoSchema),
  async (ctx) => {
    const { phoneNumber, veriCode } = ctx.request.body
    const res = await loginByPhoneNumber(phoneNumber, veriCode)
    ctx.body = res
  }
)

module.exports = router
