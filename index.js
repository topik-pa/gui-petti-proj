const express = require('express')
const app = express()
const { I18n } = require('i18n')
const path = require('path')
require('dotenv').config()
const PORT = process.env.PORT || 3000

app.set('views', './views')
app.set('view engine', 'pug')

if (process.env.NODE_ENV === 'development') {
  app.use('/components', express.static(path.join(__dirname, 'components')))
  app.use('/scripts', express.static(path.join(__dirname, 'scripts')))
  app.use('/styles', express.static(path.join(__dirname, 'styles')))
  app.use('/views', express.static(path.join(__dirname, 'views')))
}
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/dist', express.static(path.join(__dirname, 'dist')))

// For robots.txt
app.use(express.static('public'))

const i18n = new I18n({
  locales: ['en', 'it'],
  defaultLocale: 'it',
  directory: path.join(__dirname, 'locales')
})
app.use((req, res, next) => {
  i18n.init(req, res)
  next()
})

// ROUTES
require('./routes/stocks.routes')(app)
require('./routes/app.routes')(app)

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`)
})
