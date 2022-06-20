const http = require('http')
let matches

function getData () {
  const options = {
    method: 'GET',
    hostname: 'petti-proj.herokuapp.com',
    port: null,
    path: '/matches'
  }
  const request = http.request(options, function (response) {
    const chunks = []
    response.on('data', function (chunk) {
      chunks.push(chunk)
    })
    response.on('end', function () {
      const body = Buffer.concat(chunks).toString()
      try {
        matches = JSON.parse(body)
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

function getMatchFromId (id) {
  if (!matches.length) return
  for (const match of matches) {
    if (match.id === +id) {
      return match
    }
  }
}

module.exports = app => {
  app.get('/', (req, res) => {
    res.locals.matches = matches
    res.render('index', { id: 'home', title: 'Home', url: req.url })
  })
  app.get('/match/', (req, res) => {
    const match = getMatchFromId(req.query.id)
    const breadcrumbs = [
      {
        name: req.query.id
      }
    ]
    res.render('match/match', { id: 'match', title: 'Match', url: req.url, match, breadcrumbs })
  })
  app.get('*', function (req, res) {
    res.render('404/404', { id: 'err404', title: 'Error 404' })
  })
}
