var router = require('koa-router')()
const testMysqlConnect = require('../db/mysql2')
const package = require('../../package.json')
const { ENV } = require('../utils/env')
const WorkModel = require('../models/WorkModel')
const { cacheGet, cacheSet } = require('../cache')

router.get('/', function* (next) {
  yield this.render('index', {
    title: 'Hello World Koa!',
  })
})

router.get('/foo', function* (next) {
  yield this.render('index', {
    title: 'Hello World foo!',
  })
})

// 测试数据库连接
router.get('/api/db-check', function* (next) {
  // 测试 mysql 连接
  const mysqlRes = yield testMysqlConnect()

  // 测试 mongodb 连接
  let mongodbConn
  try {
    mongodbConn = true
    yield WorkModel.findOne()
  } catch (error) {
    mongodbConn = false
  }

  // 测试 redis 连接
  cacheSet('name', 'lego server ok - by redis')
  const redisTestVal = yield cacheGet('name')

  this.body = {
    errno: 0,
    data: {
      name: 'lego server',
      version: package.version,
      ENV,
      mysqlConn: mysqlRes.length > 0,
      mongodbConn,
      redisConn: redisTestVal !== null,
    },
  }
})

module.exports = router
