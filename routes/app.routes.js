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
const oddsRanges = [
  1.01,
  1.10,
  1.20,
  1.30,
  1.40,
  1.50,
  1.60,
  1.70,
  1.80,
  1.90,
  1.90,
  2.00,
  2.10,
  2.20,
  2.30,
  2.40,
  2.50,
  2.60,
  2.70,
  2.80,
  2.90,
  3.00,
  3.10,
  3.20,
  3.40,
  3.50,
  3.60,
  3.70,
  3.80,
  3.90,
  4.00,
  4.10,
  4.20,
  4.30,
  4.40,
  4.50,
  4.60,
  4.70,
  4.80,
  4.90,
  5.00,
  5.10,
  5.20,
  5.30,
  5.40,
  5.50,
  5.60,
  5.70,
  5.80,
  5.90,
  6.00,
  6.10,
  6.20,
  6.30,
  6.40,
  6.50,
  6.60,
  6.70,
  6.80,
  6.90,
  7.00
]

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

function adjustMatches () {
  if (!matches.length) return
  for (const match of matches) {
    // setCorrectScore(match)
    setRangeRank(match)
    setFavorite(match)
    setFavQuotaRange(match) // After setFavorite()
  }
}

function setFavorite (match = {}) {
  const p1Odds = match.player1.odds
  const p2Odds = match.player2.odds

  const score = match.score.trim()
  const arrScore = score.split(' ')

  if ((p1Odds && p2Odds) && (p1Odds > p2Odds)) {
    // p2 becomes p1
    const tempPlayer = match.player1
    match.player1 = match.player2
    match.player2 = tempPlayer

    // swap score
    const temp = arrScore[0]
    arrScore[0] = arrScore[2]
    arrScore[2] = temp
    match.score = arrScore.join(' ')
  }
  // W or L?
  match.favoriteWin = (arrScore[0] > arrScore[2])
}

/* function setCorrectScore (match = {}) {
  const cs20 = match.correctScore['20']
  const cs02 = match.correctScore['02']
  match.favCorrectScore = null
  if (cs20 && cs02) {
    match.favCorrectScore = (cs20 <= cs02) ? cs20 : cs02
  }
} */

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

function setFavQuotaRange (match) {
  const p1Odds = match.player1.odds
  let p1RangeOdds

  for (let i = 0; i < oddsRanges.length; i++) {
    if (i === oddsRanges.length - 1) {
      match.player1.rangeOdds = oddsRanges[i].toFixed(2)
      break
    }
    if (p1Odds < oddsRanges[i]) {
      p1RangeOdds = oddsRanges[i - 1] //
      match.player1.rangeOdds = p1RangeOdds.toFixed(2)
      break
    }
  }
}

getData()

module.exports = app => {
  app.get('/', (req, res) => {
    adjustMatches(matches)
    res.locals.matches = matches
    res.render('index', { id: 'home', title: 'Home', url: req.url })
  })
  app.get('*', function (req, res) {
    res.render('404/404', { id: 'err404', title: 'Error 404' })
  })
}
