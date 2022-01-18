const ENV = process.env.NODE_ENV || 'dev'

module.exports = {
  ENV,
  isPrd: ENV === 'production',
  isPrdDev: ENV === 'prd_dev',
  isDev: ENV === 'dev',
  isTest: ENV === 'test',
  isTestLocal: ENV === 'test_local',
  isTestRemote: ENV === 'test_remote',
}
