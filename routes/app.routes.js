const http = require('http')
let matches
const rankRanges = [
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

function getData () {
  const options = {
    method: 'GET',
    hostname: 'http://www.localhost',
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

function adjustMatches () {
  if (!matches.length) return
  for (const match of matches) {
    setCorrectScore(match)
    setRangeRank(match)
    setFavorite(match)
  }
}

function setFavorite (match = {}) {
  const p1Odds = match.player1.odds
  const p2Odds = match.player2.odds
  let tempPlayer
  if ((p1Odds && p2Odds) && (p1Odds > p2Odds)) {
    tempPlayer = match.player1
    match.player1 = match.player2
    match.player2 = tempPlayer
  }
}

function setCorrectScore (match = {}) {
  const cs20 = match.correctScore['20']
  const cs02 = match.correctScore['02']
  match.favCorrectScore = null
  if (cs20 && cs02) {
    match.favCorrectScore = (cs20 <= cs02) ? cs20 : cs02
  }
}

function setRangeRank (match) {
  const p1Rank = match.player1.origRank
  let p1RangeRank
  const p2Rank = match.player2.origRank
  let p2RangeRank

  for (let i = 0; i < rankRanges.length; i++) {
    if (i === rankRanges.length - 1) {
      match.player1.rangeRank = rankRanges[i]
      break
    }
    if (p1Rank < rankRanges[i]) {
      p1RangeRank = rankRanges[i - 1] // rankRanges[i]
      match.player1.rangeRank = p1RangeRank
      break
    }
  }

  for (let i = 0; i < rankRanges.length; i++) {
    if (i === rankRanges.length - 1) {
      match.player2.rangeRank = rankRanges[i]
      break
    }
    if (p2Rank < rankRanges[i]) {
      p2RangeRank = rankRanges[i - 1] // rankRanges[i]
      match.player2.rangeRank = p2RangeRank
      break
    }
  }
}

getData()

module.exports = app => {
  app.get('/', (req, res) => {
    // setCorrectScore(matches)
    // setRangeRank(matches)
    adjustMatches(matches)
    res.locals.matches = matches
    res.render('index', { id: 'home', title: 'Home', url: req.url })
  })
  app.get('*', function (req, res) {
    res.render('404/404', { id: 'err404', title: 'Error 404' })
  })
}
