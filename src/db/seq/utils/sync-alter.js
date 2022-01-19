const requireAll = require('require-all')
const simpleGit = require('simple-git')
const path = require('path')
const seq = require('../seq')
const { isDev } = require('../../../utils/env')

requireAll({
  dirname: path.resolve('src', 'models'),
  filter: /\.js$/,
  excludeDirs: /^\.(git|svn)$/,
  recursive: true, // 递归
})

async function syncDb() {
  let needToSyncDb = true

  if (isDev) {
    // 开发环境下，修改频繁，每次重启都同步数据表，消耗太大
    // 所以，开发环境下，判断是否修改了 src/models 中的内容
    // 如果修改了，就同步，没有修改，就无须同步
    const git = simpleGit()
    // 获取 git status 修改的文件，modified 格式如 ['.gitignore', 'package.json']
    const {
      modified,
      not_added: notAdded,
      created,
      deleted,
      renamed,
    } = await git.status()
    const fileChanged = modified.concat([
      ...notAdded,
      ...created,
      ...deleted,
      ...renamed,
    ])
    if (fileChanged.length) {
      const changedDbFiles = fileChanged.some((file) => {
        // 改动了 src/models
        if (file.indexOf('src/models/') === 0) return true
        // 改动了 src/db/seq
        if (file.indexOf('src/db/seq/') === 0) return true
        return false
      })
      // 没有改动同步数据库的相关文件
      if (!changedDbFiles) {
        needToSyncDb = false
      }
    }
  }

  if (needToSyncDb) {
    await seq.sync({ alter: true })
  }
}

module.exports = syncDb
