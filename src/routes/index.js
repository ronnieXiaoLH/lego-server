var router = require('koa-router')()
const testMysqlConnect = require('../db/mysql2')
const package = require('../../package.json')
const { ENV } = require('../utils/env')

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
  const mysqlRes = yield testMysqlConnect()

  this.body = {
    errno: 0,
    data: {
      name: 'lego server',
      version: package.version,
      ENV,
      mysqlConn: mysqlRes.length > 0,
    },
  }
})

module.exports = router
