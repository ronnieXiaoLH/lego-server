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
}
