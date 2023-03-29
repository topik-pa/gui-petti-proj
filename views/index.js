const $table = document.getElementById('table')
// eslint-disable-next-line no-undef
const origMatches = matches
let currentMatches = origMatches

function resetTable (rows) {
  const $tBody = $table.getElementsByTagName('tbody')[0]
  const $tCaption = $table.getElementsByTagName('span')[0]
  $tBody.innerHTML = ''
  for (const row of rows) {
    const $tr = document.createElement('tr')
    $tr.innerHTML =
    `
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
      <td class="p1">${row.player2.stringIdCount}</td>
    `
    $tBody.appendChild($tr)
  }
  $tCaption.innerText = rows.length
}

function filterTable () {
  const $inputs = $table.getElementsByTagName('thead')[0].getElementsByTagName('input')
  const setFilter = function () {
    currentMatches = origMatches
    for (const $input of $inputs) {
      const filter = $input.dataset.filter
      if (filter === undefined || filter === '') continue
      currentMatches = currentMatches.filter((match) => {
        const pathArr = $input.dataset.path.split(',')
        const path0 = pathArr[0]
        const path1 = pathArr[1] || undefined
        return path1 === undefined ? match[path0].toString().includes($input.value) : match[path0][path1].toString().includes($input.value)
      })
    }
  }
  for (const $input of $inputs) {
    $input.addEventListener('input', (e) => {
      e.target.dataset.filter = e.target.value
      setFilter()
      resetTable(currentMatches)
    })
  }
}

function sortTable () {
  const $arrows = $table.getElementsByTagName('thead')[0].getElementsByTagName('span')
  const setSorting = function (sorting, path) {
    // currentMatches = origMatches
    const pathArr = path.split(',')
    const path0 = pathArr[0]
    const path1 = pathArr[1] || undefined
    if (sorting === 'asc') {
      path1 === undefined ? currentMatches.sort((a, b) => (a[path0] > b[path0]) ? 1 : -1) : currentMatches.sort((a, b) => (a[path0][path1] > b[path0][path1]) ? 1 : -1)
    } else {
      path1 === undefined ? currentMatches.sort((a, b) => (a[path0] < b[path0]) ? 1 : -1) : currentMatches.sort((a, b) => (a[path0][path1] < b[path0][path1]) ? 1 : -1)
    }
  }
  for (const $arrow of $arrows) {
    $arrow.addEventListener('click', (e) => {
      e.target.dataset.sorting = e.target.dataset.sorting === 'asc' ? 'desc' : 'asc'
      setSorting(e.target.dataset.sorting, e.target.dataset.path)
      resetTable(currentMatches)
    })
  }
}

const index = {
  init: async () => {
    resetTable(origMatches)
    filterTable()
    sortTable()
  }
}

export default index
