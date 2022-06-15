const http = require('http')
let stocks

function getData () {
  const options = {
    method: 'GET',
    hostname: 'localhost',
    port: 8080,
    path: '/api'
  }
  const request = http.request(options, function (response) {
    const chunks = []
    response.on('data', function (chunk) {
      chunks.push(chunk)
    })
    response.on('end', function () {
      const body = Buffer.concat(chunks).toString()
      try {
        stocks = JSON.parse(body)
      } catch (error) {
        console.error(error)
      }
    })
  })
  request.end()
  request.on('error', error => {
    console.error(error)
  })
}
getData()

module.exports = app => {
  app.get('/', (req, res) => {
    res.locals.stocks = stocks
    res.render('index', { id: 'home', title: 'Home', url: req.url })
  })
  app.get('*', function (req, res) {
    res.locals.stocks = stocks
    res.render('404/404', { id: 'err404', title: 'Error 404' })
  })
}
