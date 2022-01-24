// 手机号规则
const phoneNumberRule = {
  type: 'string',
  pattern: '^1[34578]\\d{9}$', // 手机号正则
}

// 手机号 schema
const phoneNumberSchema = {
  type: 'object',
  required: ['phoneNumber'],
  properties: {
    phoneNumber: phoneNumberRule,
    isRemoteTest: {
      type: 'boolean',
    },
  },
}

// 手机号 + 短信验证码 schema
const userInfoSchema = {
  type: 'object',
  required: ['phoneNumber', 'veriCode'],
  properties: {
    phoneNumber: phoneNumberRule,
    veriCode: {
      type: 'string',
      pattern: '^\\d{4}$',
    },
  },
}

module.exports = {
  phoneNumberSchema,
  userInfoSchema,
}
