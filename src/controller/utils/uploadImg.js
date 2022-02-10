const fs = require('fs')
const formidable = require('formidable')
const _ = require('lodash')
const { ErrorRes, SuccessRes } = require('../../res-model')
const { uploadImgFailInfo } = require('../../res-model/failInfo')
const { uploadOSS } = require('../../vendor/uploadOSS')

const form = formidable({ multiples: true })

/**
 * 上传图片
 * @param {object} req ctx.req
 * @returns
 */
async function uploadImg(req) {
  let urls
  try {
    urls = await uploadImgByFormidable(req)
  } catch (error) {
    console.error('上传图片错误', error)
    return new ErrorRes(uploadImgFailInfo)
  }

  return new SuccessRes({ urls })
}

/**
 * 通过 formidable 上传文件到阿里云
 * @param {object} req ctx.req
 * @returns
 */
function uploadImgByFormidable(req) {
  const promise = new Promise((resolve, reject) => {
    form.parse(req, async function upload(err, fields, files) {
      if (err) {
        reject(err)
      }

      // 遍历所有的图片，并上传
      const filesKeys = Object.keys(files)
      try {
        const links = await Promise.all(
          filesKeys.map((fileKey) => {
            const file = files[fileKey]
            let fileName = file.name || fileKey
            // 给文件名加一个后缀，防止重复
            fileName = addSuffixForFileName(fileName)
            return uploadOSS(fileName, file.path)
          })
        )

        // formidable 把接口上传的文件，存储到 files 中(本地)
        // 上传到 oss 中后，删除源文件
        _.forEach(files, (file) => {
          fs.unlinkSync(file.path)
        })

        resolve(links)
      } catch (error) {
        reject(error)
      }
    })
  })

  return promise
}

/**
 * 给文件名加后缀，如 a.png 变为 a-xxx.png
 * @param {string} fileName
 * @returns
 */
function addSuffixForFileName(fileName = '') {
  // 用随机数做后缀
  const suffix = Math.random().toString().slice(-6)

  if (!fileName) return ''

  const lastPointIndex = fileName.lastIndexOf('.')
  if (lastPointIndex < 0) {
    // 文件名没有后缀名
    return `${fileName}-${suffix}`
  }
  return `${fileName.slice(0, lastPointIndex)}-${suffix}${fileName.slice(
    lastPointIndex
  )}`
}

module.exports = {
  uploadImg,
}
