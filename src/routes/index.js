const router = require('koa-router')()
const testMysqlConnect = require('../db/mysql2')
const pkg = require('../../package.json')
const { ENV } = require('../utils/env')
const WorkModel = require('../models/WorkModel')
const { cacheGet, cacheSet } = require('../cache')

// 测试数据库连接
router.get('/api/db-check', async (ctx, next) => {
  // 测试 mysql 连接
  const mysqlRes = await testMysqlConnect()

  // 测试 mongodb 连接
  let mongodbConn
  try {
    mongodbConn = true
    await WorkModel.findOne()
  } catch (error) {
    mongodbConn = false
  }

  // 测试 redis 连接
  cacheSet('name', 'lego server ok - by redis')
  const redisTestVal = await cacheGet('name')

  ctx.body = {
    errno: 0,
    data: {
      name: 'lego server',
      version: pkg.version,
      ENV,
      mysqlConn: mysqlRes.length > 0,
      mongodbConn,
      redisConn: redisTestVal !== null,
    },
  }
})

module.exports = router
