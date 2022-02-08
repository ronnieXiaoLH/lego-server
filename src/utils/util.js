const os = require('os')
const _ = require('lodash')

module.exports = {
  // 判断是否是 windows 系统
  isWindows: os.type().toLowerCase().indexOf('windows') >= 0,
  /**
   * 将 obj 变成 string, 根据 key 排序
   * 如把 {b:2,a:1,c:3} 变为 a=1&b=2&c=3
   * @param {object} obj
   * @returns
   */
  getSortedObjStr(obj = {}) {
    if (_.isEmpty(obj)) return ''
    const keys = Object.keys(obj).sort()
    const arr = keys.map((key) => {
      const val = obj[key]
      return `${key}=${val}`
    })
    return arr.join('&')
  },
}
