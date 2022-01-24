// errno: 1200x
module.exports = {
  // 发送短信验证码过于频繁
  sendVericodeFrequentlyFailInfo: {
    errno: 12002,
    message: '请勿频繁发送短信验证码',
  },

  // 发送短信验证码错误
  sendVericodeErrorFailInfo: {
    errno: 12003,
    message: '发送短信失败，请稍后重试',
  },

  // 登录时，验证码不正确
  loginVericodeIncorrectFailInfo: {
    errno: 12004,
    message: '验证码不正确',
  },

  // 创建用户，写入数据库，失败
  createUserDbErrorFailInfo: {
    errno: 12005,
    message: '创建用户失败 db error',
  },

  // 用户被冻结
  userFrozenFailInfo: {
    errno: 12008,
    message: '你的账户已被冻结，请联系管理员',
  },
}
