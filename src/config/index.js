const {
  mysqlConf,
  redisConf,
  mongodbConf,
  corsOrigin,
  msgVericodeTimeout,
  jwtExpiresIn,
} = require('./envs/dev')

module.exports = {
  mysqlConf,
  redisConf,
  mongodbConf,
  corsOrigin,
  msgVericodeTimeout,
  jwtExpiresIn,
}
