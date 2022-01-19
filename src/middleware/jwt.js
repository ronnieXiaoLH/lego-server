const jwtKoa = require('koa-jwt')
const { JWT_SECRET, JWT_INGORE_PATH } = require('../config/constant')

module.exports = jwtKoa({
  secret: JWT_SECRET,
  // 使用 cookie 存储 token
  cookie: 'jwt_token',
}).unless({
  // 定义哪些路由忽略 jwt 验证
  path: JWT_INGORE_PATH,
})
