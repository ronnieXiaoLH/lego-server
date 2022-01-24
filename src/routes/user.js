const router = require('koa-router')()
const sendVericode = require('../controller/users/sendVericode')
const genValidator = require('../middleware/genValidator')
const { phoneNumberSchema } = require('../validator/users')

// 路由前缀
router.prefix('/api/users')

// 生成短信验证码
router.post('/getVericode', genValidator(phoneNumberSchema), async (ctx) => {
  const { phoneNumber, isRemoteTest } = ctx.request.body
  const res = await sendVericode(phoneNumber, isRemoteTest)
  ctx.body = res
})

module.exports = router
