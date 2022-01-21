const { STRING, DATE, BOOLEAN } = require('sequelize')
const seq = require('../db/seq/seq')

const User = seq.define('user', {
  username: {
    type: STRING,
    allowNull: false,
    unique: 'username',
    comment: '用户名，唯一',
  },
  password: {
    type: STRING,
    allowNull: false,
    comment: '密码',
  },
  phoneNumber: {
    type: STRING,
    allowNull: false,
    unique: 'phoneNumber',
    comment: '手机号，唯一',
  },
  nickName: {
    type: STRING,
    comment: '密码',
  },
  gender: {
    type: STRING,
    allowNull: false,
    defaultValue: 0,
    comment: '性别（1 男性，2 女性，0 保密）',
  },
  picture: {
    type: STRING,
    comment: '头像，图片地址',
  },
  city: {
    type: STRING,
    comment: '城市',
  },
  latestLoginAt: {
    type: DATE,
    defaultValue: null,
    comment: '最后登录时间',
  },
  isFrozen: {
    type: BOOLEAN,
    defaultValue: null,
    comment: '用户是否冻结',
  },
})

module.exports = User
