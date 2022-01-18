const mongoose = require('../db/mongoose')

const WorkSchema = mongoose.Schema(
  {
    // 标题
    title: String,
    // 页面的组件列表
    comonents: [Object],
    // 页面的属性，保证扩展性
    props: Object,
    // 配置信息，保证扩展性
    setting: Object,
  },
  {
    timestamps: true,
  }
)

const WorkModel = mongoose.model('work', WorkSchema)

module.exports = WorkModel
