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
  url: 'http://localhost:8080/matches', //
  limit: 100,
  page: 0,
  total: undefined,
  pages: undefined,
  start: undefined,
  end: undefined,
  filterReqDelay: 600
}

const queryString = {
  filters: [],
  sorts: [{ sortBy: 'time', order: 'desc' }], // [{ sortBy: 'time', order: 'desc' }],
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
      <td>${new Date(row.time).toLocaleDateString()}</td>
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
      <td>${row.sid2?.value}</td>
      <td>${row.sid2?.countW}</td>
      <td>${row.sid2?.countL}</td>
      <td>${row.sid2?.perc}</td>
      <td class="${row.sid2?.result}"></td>
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
