const cors = require('koa2-cors')
const { corsOrigin } = require('../config')

module.exports = cors({
  origin: (ctx) => {
    // 非线上环境，无 cors 限制
    if (corsOrigin === '*') return '*'

    // 线上环境
    const ref = ctx.header.referer || ''
    const originArr = corsOrigin.split(',').map((s) => s.trim())
    const originArrByRef = originArr.filter((s) => ref.indexOf(s) === 0)
    if (originArrByRef.length) return originArrByRef[0]

    // 其他情况
    return false
  },
  // 跨域允许携带 cookie
  credential: true,
})
