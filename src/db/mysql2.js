const mysql = require('mysql2/promise')
const { mysqlConf } = require('../config')

async function testMysqlConnect() {
  const connection = await mysql.createConnection(mysqlConf)
  const [rows] = await connection.execute('select now();')
  return rows
}

// 直接执行 node src/db/mysql2.js 进行测试
// ;(async () => {
//   const rows = await testMysqlConnect()
//   console.log(rows)
// })()

module.exports = testMysqlConnect
