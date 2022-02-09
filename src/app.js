const Koa = require('koa')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const jwt = require('./middleware/jwt')
const cors = require('./middleware/cors')

const index = require('./routes/index')
const user = require('./routes/user')
const work = require('./routes/work')
const template = require('./routes/template')
const channel = require('./routes/channel')

const app = new Koa()

// error handler
onerror(app)

app.use(jwt)
app.use(cors)

// global middlewares
app.use(
  views('views', {
    // eslint-disable-next-line
    root: __dirname + '/views',
    default: 'ejs',
  })
)
app.use(bodyparser())
app.use(json())
app.use(logger())

app.use(async (ctx, next) => {
  var start = new Date()
  await next()
  var ms = new Date() - start
  console.log('%s %s - %s', ctx.method, ctx.url, ms)
})

// eslint-disable-next-line
app.use(require('koa-static')(__dirname + '/public'))

// routes definition
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(work.routes(), work.allowedMethods())
app.use(template.routes(), template.allowedMethods())
app.use(channel.routes(), channel.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
