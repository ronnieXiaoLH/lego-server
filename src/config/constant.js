module.exports = {
  // jwt 秘钥
  JWT_SECRET: 'secret_for-json#web$token',
  // jwt 可忽略的 path，全部忽略即可，需要登录验证的，自己用 loginCheck
  JWT_INGORE_PATH: [/\//],
}
