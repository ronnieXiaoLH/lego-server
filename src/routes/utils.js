const router = require('koa-router')()
const { uploadImg } = require('../controller/utils/uploadImg')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/utils')

// 上传图片(form-data 形式，支持多文件上传)
router.post('/upload-img', loginCheck, async (ctx) => {
  const res = await uploadImg(ctx.req)
  ctx.body = res
})

module.exports = router
