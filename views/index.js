/**
 * @file dTable - A Dynamic Pure JS Table
 * @description dTable provides data sorting, filtering and pagination
 * @author Marco Pavan
 * @version 1.0
 * @copyright Marco Pavan 2023
 */

const $table = document.getElementById('dtable')
const $pagination = $table.querySelector('#pagination')
const $navigation = $table.querySelector('ul')
const $tHeader = $table.querySelector('thead')
const $filters = $tHeader.querySelectorAll('input')

let filterTimer

const tConfig = { // APIRELATED
  url: 'http://localhost:8080/matches',
  limit: 25,
  page: 0,
  total: undefined,
  pages: undefined,
  start: undefined,
  end: undefined,
  filterReqDelay: 800
}

const queryString = {
  filters: [],
  sorts: [],
  get () {
    let qs = '?'
    qs += `page=${tConfig.page}`
    qs += `&limit=${tConfig.limit}`
    this.sorts.forEach(sort => {
      qs += `&sortby=${encodeURIComponent(sort.sortBy)}`
      qs += `&order=${sort.order}`
    })
    this.filters.forEach(f => {
      qs += `&filterby=${encodeURIComponent(f.filterBy)}`
      qs += `&filter=${encodeURIComponent(f.filter)}`
    })
    return qs
  }
}

/* const dateFilter = (date = undefined) => {
  return new Date(date).toLocaleString()
} */

$navigation.addEventListener('click', async (e) => {
  const nextPage = +e.target.dataset.page
  if (isNaN(nextPage) || tConfig.page === nextPage) return
  tConfig.page = nextPage
  await loadRowsData()
})

$tHeader.addEventListener('click', async (e) => {
  const sortBy = e.target.dataset.path
  if (!sortBy) return
  const order = e.target.dataset.order
  /* for (const th of $tHeader.getElementsByTagName('th')) {
     th.removeAttribute('data-order')
   } */
  e.target.dataset.order = order === 'asc' ? 'desc' : order === 'desc' ? 'asc' : 'asc'
  queryString.sorts = queryString.sorts.filter((s) => {
    return s.sortBy !== sortBy
  })
  queryString.sorts.push({ sortBy, order: e.target.dataset.order })
  await loadRowsData()
})

const startFilterRequestTimer = (el) => {
  // Add a little pause before call the remote server (only on filters)
  filterTimer = setTimeout(async () => {
    const filter = el.value
    const filterBy = el.parentElement.dataset.path
    queryString.filters = queryString.filters.filter((f) => {
      return f.filterBy !== filterBy
    })
    queryString.filters.push({ filterBy, filter })
    await loadRowsData()
  }, tConfig.filterReqDelay)
}
for (const $filter of $filters) {
  $filter.addEventListener('input', async (e) => {
    if (!filterTimer) {
      startFilterRequestTimer(e.target)
    } else {
      clearTimeout(filterTimer)
      startFilterRequestTimer(e.target)
    }
  })
}

/**
  * buildRows
  * @description Build a table row for every result found on remote data
  */
const buildRows = (rows) => {
  const $tBody = $table.getElementsByTagName('tbody')[0]
  $tBody.innerText = ''
  for (const row of rows) {
    const $tr = document.createElement('tr')
    // APIRELATED
    $tr.innerHTML = `
      <td>${row.id}</td>
      <td>${row.date}</td>
      <td>${row.hours}</td>
      <td>${row.score}</td>
      <td>${row.favoriteWin ? 'W' : 'L'}</td>
      <td class="p1">${row.player1.name}</td>
      <td class="p2">${row.player2.name}</td>
      <td class="p1">${row.player1.origRank}</td>
      <td class="p2">${row.player2.origRank}</td>
      <td class="p1">${row.player1.rangeRank}</td>      
      <td class="p2">${row.player2.rangeRank}</td>
      <td class="p1">${row.player1.odds.toFixed(2)}</td>
      <td class="p2">${row.player2.odds.toFixed(2)}</td>
      <td class="p1">${row.player1.rangeOdds}</td>
      <td class="p1">${row.inv}</td>
      <td class="p1">${row.correctScore}</td>
      <td>${row.association}</td>
      <td>${row.surface}</td>
      <td><a title="${row.tournament.name}" href="${row.tournament.url}">${row.tournament.name}</a></td>
      <td>${row.tournament.value}</td>
      <td>${row.round}</td>
      <td class="${row.dataOrigin}"><a href="https://www.tennisexplorer.com/match-detail/?id=${row.id}" target="_blank" rel="noopener noreferrer">match</a></td>
      <td class="p1">${row.player1.stringId}</td>
      <td class="p1">${row.player1.stringIdCount}</td>
      <td class="p2">${row.player2.stringId}</td>
      <td class="p2">${row.player2.stringIdCount}</td>
     `
    // APIRELATED
    $tBody.appendChild($tr)
  }
}

/**
  * updateDOMPagination
  * @description Update pagination data like current totals and pages number
  */
const updateDOMPagination = () => {
  $pagination.querySelector('#total').innerText = tConfig.total
  $pagination.querySelector('#start').innerText = tConfig.start
  $pagination.querySelector('#end').innerText = tConfig.end
  $pagination.querySelector('#page').innerText = (tConfig.page + 1)
  $pagination.querySelector('#pages').innerText = tConfig.pages
}

/**
  * setNavigation
  * @description Print pagination links
  */
const setNavigation = () => {
  $navigation.innerText = ''
  for (let i = 0; i < tConfig.pages; i++) {
    const $li = document.createElement('li')
    $li.innerText = (i + 1)
    $li.setAttribute('data-page', (i))
    if (i === tConfig.page) $li.classList.add('active')
    $navigation.appendChild($li)
  }
}

/**/

function improveMatchData (matches) {
  if (!matches.length) return
  const setRangeRank = (match) => {
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
  const setFavorite = (match) => {
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
  const setFavQuotaRange = (match) => {
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
  const setUniqueStringForWAndL = (match) => {
    const uniqueStringP1 = `${match.player1.name.replace(/ /g, '_')}%${match.tournament.value}%${match.association}%${match.surface}%${match.player2.rangeRank}%${match.favoriteWin ? 'win' : 'lose'}`
    const uniqueStringP2 = `${match.player2.name.replace(/ /g, '_')}%${match.tournament.value}%${match.association}%${match.surface}%${match.player1.rangeRank}%${match.favoriteWin ? 'lose' : 'win'}`
    match.player1.stringId = uniqueStringP1
    match.player2.stringId = uniqueStringP2
  }
  const countStringIDs = (matches) => {
    const players = ['player1', 'player2']
    for (const match of matches) {
      for (const player of players) {
        let counter = 0
        const currSID = match[player].stringId

        for (let i = 0; i < matches.length; i++) {
          const innerMatch = matches[i]
          if (currSID === innerMatch[player].stringId) {
            counter++
          }
        }

        match[player].stringIdCount = counter
      }
    }
  }
  for (const match of matches) {
    setRangeRank(match)
    setFavorite(match)
    setFavQuotaRange(match) // After setFavorite()
    setUniqueStringForWAndL(match) // After all
  }
  countStringIDs(matches)
}
/**/

/**
  * loadRowsData
  * @description Load remote data, inits configuration data, starts pagination features
  * @async
  */
const loadRowsData = async () => {
  $table.classList.add('loading')
  await fetch(tConfig.url + queryString.get())
    .then(response => {
      if (!response.ok) throw (Error(`Status: ${response.status}. ${response.statusText}`))
      return response.json()
    })
    .then((json) => {
      const matches = json.matches
      improveMatchData(matches)
      buildRows(matches) // APIRELATED
      tConfig.total = json.total // APIRELATED
      tConfig.pages = Math.ceil(tConfig.total / tConfig.limit)
      tConfig.end = tConfig.limit * (tConfig.page + 1)
      tConfig.start = (tConfig.end - tConfig.limit) + 1
      if (tConfig.end > tConfig.total) {
        tConfig.end = tConfig.total
        tConfig.start = (tConfig.limit * (tConfig.pages - 1)) + 1
      }
    })
    .catch((error) => {
      tConfig.total = 0
      tConfig.page = -1
      tConfig.pages = 0
      tConfig.start = 0
      tConfig.end = 0
      $table.classList.add('error')
      console.error(error)
    })
    .finally(() => {
      updateDOMPagination()
      setNavigation()
      $table.classList.remove('loading')
    })
}

const index = {
  init: async () => {
    await loadRowsData()
  }
}

export default index
