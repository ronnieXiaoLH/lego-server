/**
 * 基础数据模型，包括 errno, data, message
 */
class BaseRes {
  constructor({ errno, data, message }) {
    this.errno = errno
    if (data) {
      this.data = data
    }
    if (message) {
      this.message = message
    }
  }
}

/**
 * 执行失败数据模型
 */
class ErrorRes extends BaseRes {
  constructor({ errno = -1, message = '', data }, addMessage = '') {
    super({
      errno,
      message: addMessage ? `${message} - ${addMessage}` : message,
      data,
    })
  }
}

/**
 * 执行成功的数据模型
 */
class SuccessRes extends BaseRes {
  constructor(data = {}) {
    super({
      errno: 0,
      data,
    })
  }
}

module.exports = {
  ErrorRes,
  SuccessRes,
}
