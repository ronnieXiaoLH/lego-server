const fs = require('fs')
const OSS = require('ali-oss')
const { aliyunOSSConf } = require('../config/envs/dev')

const client = new OSS(aliyunOSSConf)

/**
 * 阿里云 OSS 上传文件
 * @param {string} fileName 文件名
 * @param {string} filePath 文件路径
 * @returns
 */
async function uploadOSS(fileName, filePath) {
  const stream = fs.createReadStream(filePath)

  try {
    const floder = 'upload-files'
    // 使用流的方式上传图片
    const res = await client.putStream(`${floder}/${fileName}`, stream)
    return res.url
  } catch (error) {
    console.error('阿里云 OSS 上传错误', error)
    throw new Error('阿里云 OSS 上传错误')
  }
}

module.exports = {
  uploadOSS,
}
