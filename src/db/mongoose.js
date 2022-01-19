const mongoose = require('mongoose')
const { mongodbConf } = require('../config')

const { host, port, dbName, user, password } = mongodbConf

// 拼接连接字符串
let url = `mongodb://${host}:${port}` // dev 环境
if (user && password) {
  url = `mongodb://${user}:${password}@${host}:${port}` // prd环境
}

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

// 开始连接 (使用用户名和密码时，需要 `?authSource=admin`)
mongoose.connect(`${url}/${dbName}?authSource=admin`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// 连接对象
const db = mongoose.connection

db.on('error', (err) => {
  console.error('mongoose connect error', err)
})

// db.once('open', () => {
//   // 用以测试数据库连接是否成功
//   console.log('mongoose connect success')
// })

module.exports = mongoose
