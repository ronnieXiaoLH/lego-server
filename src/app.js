const Koa = require('koa')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const jwt = require('./middleware/jwt')

const app = new Koa()

// error handler
onerror(app)

// app.use(jwt)

// global middlewares
app.use(
  views('views', {
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

app.use(require('koa-static')(__dirname + '/public'))

// routes definition
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
