module.exports = {
  // mysql 连接配置
  mysqlConf: {
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: 3306,
    database: 'lego',
  },

  // mongodb 连接配置
  mongodbConf: {
    host: 'localhost',
    port: '27017',
    dbName: 'lego',
  },

  // redis 连接配置
  redisConf: {
    host: '127.0.0.1',
    port: '6379',
  },

  // cors origin
  corsOrigin: '*',

  // 短信验证码缓存时间，单位秒
  msgVericodeTimeout: 2 * 60,

  // jwt 过期时间
  jwtExpiresIn: '1d', // 1. 字符串，如 '1h' '2d'； 2. 数字，单位是 s

  // 发布出来的 h5 域名
  h5Origin: 'http://localhost:3001',

  // 阿里云 OSS 配置
  aliyunOSSConf: {
    // LTAI5tPWF6t ------- cvU7JceExPqME
    accessKeyId: '**',
    // 62dikcHZjijMby ---- 9bf33VYrre0si5ss
    accessKeySecret: '**',
    bucket: 'my-lego',
    region: 'oss-cn-shenzhen',
  },
}
