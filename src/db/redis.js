const redis = require('redis')
const { redisConf } = require('../config')

// 创建客户端
const { host, port, password } = redisConf
const opts = {}
if (password) {
  opts.password = password // prd 环境需要密码
}
const redisClient = redis.createClient(port, host, opts)
redisClient.on('error', (err) => {
  console.error('redis connect error', err)
})

// 可运行 node src/db/redis.js 测试连接
// redisClient.on('connect', () => {
//   console.log('redis connect success')
//   redisClient.quit()
// })

module.exports = redisClient
