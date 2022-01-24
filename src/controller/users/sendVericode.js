const { isPrd, isTest } = require('../../utils/env')
const { ErrorRes, SuccessRes } = require('../../res-model/index')
const {
  sendVericodeFrequentlyFailInfo,
  sendVericodeErrorFailInfo,
} = require('../../res-model/failInfo')
const {
  getVericodeFromCache,
  setVericodeToCache,
} = require('../../cache/users/veriCode')
const { msgVericodeTimeout } = require('../../config')

/**
 *
 * @param {string} phoneNumber 手机号
 * @param {boolean} isRemoteTest 是否测试
 * @returns
 */
async function sendVericode(phoneNumber, isRemoteTest) {
  // 从缓存获取验证码，判断是否有效
  const codeFromCache = await getVericodeFromCache(phoneNumber)
  if (codeFromCache) {
    if (!isPrd) {
      // 非线上环境，直接返回
      return new SuccessRes({ code: codeFromCache })
    }
    // 刚刚已经发送过，不要再重新发送 - 【注意】：轻易重复发送短信，短信服务会浪费不少钱
    return new ErrorRes(sendVericodeFrequentlyFailInfo)
  }

  // 缓存中没有，则发送
  const vericode = Math.random().toString().slice(-4) // 生成随机数
  let sendSuccess = false

  if (isTest) {
    // 本地接口测试，不用发送短信，直接返回验证码
    sendSuccess = true
  } else if (isRemoteTest) {
    // 用于远程接口测试，也不用发送短信
    sendSuccess = true
  } else {
    // 其他情况，发送短信
    try {
      // 短信提示的过期时间(单位分钟)
      // eslint-disable-next-line
      const msgTimeoutMin = (msgVericodeTimeout / 60).toString()
      // 发送短信
      // await sendVericodeMsg(phoneNumber, vericode, msgTimeoutMin)
      sendSuccess = true
    } catch (error) {
      sendSuccess = false
      console.error('发送短信验证码失败', error)
    }
  }

  if (!sendSuccess) {
    return new ErrorRes(sendVericodeErrorFailInfo)
  }

  // 缓存，设置 timeout
  setVericodeToCache(phoneNumber, vericode, msgVericodeTimeout)

  // 返回成功信息
  const resData = isPrd ? {} : { code: vericode }
  return new SuccessRes(resData)
}

module.exports = sendVericode
