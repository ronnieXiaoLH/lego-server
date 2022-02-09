const {
  createChannel,
  updateChannelName,
  deleteChannel,
  getWorkChannels,
} = require('../controller/channel')
const loginCheck = require('../middleware/loginCheck')

const router = require('koa-router')()

router.prefix('/api/channel')

// 创建渠道
router.post('/', loginCheck, async (ctx) => {
  const res = await createChannel(ctx.request.body)
  ctx.body = res
})

// 更新渠道名称
router.patch('/updateName/:id', loginCheck, async (ctx) => {
  const { id } = ctx.params
  const { name } = ctx.request.body
  const res = await updateChannelName(id, name)
  ctx.body = res
})

// 删除渠道
router.delete('/:id', loginCheck, async (ctx) => {
  const { id } = ctx.params
  const res = await deleteChannel(id)
  ctx.body = res
})

// 获取一个作品的所有渠道
router.get('/getWorkChannels/:workId', loginCheck, async (ctx) => {
  const { workId } = ctx.params
  const res = await getWorkChannels(workId)
  ctx.body = res
})

module.exports = router
