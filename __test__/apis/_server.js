const supertest = require('supertest')
const { isTestLocal } = require('../../src/utils/env')

let request

if (isTestLocal) {
  const server = require('../../src/app').callback()
  request = supertest(server)
}

// 存储登录 token ，统一拼装 headers.Authorization
let TOKEN = ''

async function ajax(method = 'get', url = '', bodyOrParams = {}, headers = {}) {
  if (headers.Authorization === null) {
    Object.assign(headers, {
      Authorization: `Bearer ${TOKEN}`,
    })
  }

  let result

  if (isTestLocal) {
    let res
    if (method === 'get') {
      res = await request[method](url).query(bodyOrParams).set(headers)
    } else {
      res = await request[method](url).send(bodyOrParams).set(headers)
    }
    result = res.body
  }

  return result
}

module.exports = {
  setToken(token) {
    TOKEN = token
  },
  async get(url, params) {
    const res = await ajax('get', url, params)
    return res
  },
  async post(url, body) {
    const res = await ajax('post', url, body)
    return res
  },
  async patch(url, body) {
    const res = await ajax('patch', url, body)
    return res
  },
  async del(url, body) {
    const res = await ajax('delete', url, body)
    return res
  },
}
