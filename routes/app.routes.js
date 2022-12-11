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

function setCorrectScore () {
  if (!matches.length) return
  for (const match of matches) {
    if (match.correctScore === undefined) continue
    if (match.correctScore['20'] < match.correctScore['02']) {
      match.favCorrectScore = match.correctScore['20']
    } else {
      match.favCorrectScore = match.correctScore['02']
    }
  }
  // delete match.CorrectScore
}

function setRangeRank () {
  if (!matches.length) return
  const ranges = [
    1,
    6,
    10,
    30,
    60,
    100,
    150,
    200,
    250,
    300,
    350,
    400,
    450,
    500,
    550,
    600,
    650,
    700,
    750,
    800,
    850,
    900,
    950,
    1000,
    1100,
    1200,
    1300,
    1400,
    1500,
    1600,
    1700,
    1800,
    1900,
    2000,
    2100,
    2200,
    2300,
    2400,
    2500,
    2600,
    2700,
    2800,
    2900,
    3000]
  for (const match of matches) {
    const p1Rank = parseInt(match.player1.rank)
    const p2Rank = parseInt(match.player2.rank)

    let p1RangeRank = ranges[ranges.length - 1]
    let p2RangeRank = ranges[ranges.length - 1]

    for (let i = 0; i < ranges.length; i++) {
      if (p1Rank < ranges[i]) {
        p1RangeRank = ranges[i - 1]
        match.player1.rangeRank = p1RangeRank
        break
      }
    }
    for (let i = 0; i < ranges.length; i++) {
      if (p2Rank < ranges[i]) {
        p2RangeRank = ranges[i - 1]
        match.player2.rangeRank = p2RangeRank
        break
      }
    }
  }
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
    setRangeRank(matches)
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
