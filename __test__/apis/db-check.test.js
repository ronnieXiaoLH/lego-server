const { get } = require('./_server')

describe('GET /api/db-check', () => {
  test('数据库连接', () => {
    get('api/db-check').then(({ errno, data }) => {
      const { mysqlConn, mongodbConn, redisConn } = data

      expect(errno).toBe(0)
      expect(mysqlConn).toBe(true)
      expect(mongodbConn).toBe(true)
      expect(redisConn).toBe(true)
    })
  })
})
