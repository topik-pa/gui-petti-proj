const http = require('http')
let matches

function getData () {
  const options = {
    method: 'GET',
    hostname: 'localhost',
    port: 8080,
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

function setCorrectScore () {
  if (!matches.length) return
  for (const match of matches) {
    if (match.CorrectScore === undefined) continue
    if (match.CorrectScore['20'] < match.CorrectScore['02']) {
      match.favCorrectScore = match.CorrectScore['20']
    } else {
      match.favCorrectScore = match.CorrectScore['02']
    }
  }
  // delete match.CorrectScore
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
    setCorrectScore(matches)
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
