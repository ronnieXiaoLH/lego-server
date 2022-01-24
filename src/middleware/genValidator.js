const Ajv = require('ajv')
const { ErrorRes } = require('../res-model')
const { validateErrorInfo } = require('../res-model/failInfo')

const ajv = new Ajv({
  // 输出所有错误
  allErrors: true,
})

/**
 * json schema 校验
 * @param {Object} schema json schema 规则
 * @param {*} data 待校验的数据
 * @returns {Array | undefined} 错误信息 | undefined
 */
function validate(schema, data) {
  const validate = ajv.compile(schema)
  const valid = validate(data)
  if (!valid) {
    return validate.errors
  }
  return undefined
}

/**
 * json schema 校验中间件
 * @param {Obejct} schema schema 规则
 * @returns
 */
function genValidator(schema) {
  async function validator(ctx, next) {
    const data = ctx.request.body
    const validateErrors = validate(schema, data)
    // 校验失败，返回错误信息
    if (validateErrors) {
      ctx.body = new ErrorRes({
        ...validateErrorInfo,
        data: validateErrors,
      })
      return
    }
    // 校验成功，继续
    await next()
  }
  return validator
}

module.exports = genValidator
