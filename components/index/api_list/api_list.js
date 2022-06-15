import api from '../../../scripts/api.js'
let $root, cls

async function callTheApi (apis) {
  for (const apiCall of apis) {
    if (apiCall.category !== 'api') {
      continue
    }
    if (apiCall.status !== 'idle') {
      printApiStocksInPage(apiCall)
      continue
    }
    apiCall.status = 'loading'
    updateUIStatus(apiCall)
    try {
      const request = await api.get(`api/stocks/${apiCall.name}/?${apiCall.qp}`)
      apiCall.stocks = request.body
      apiCall.status = 'success'
    } catch (error) {
      apiCall.status = 'error'
      console.error(error)
    }
    updateUIStatus(apiCall)
    printApiStocksInPage(apiCall)
  }
}

function updateUIStatus (apiCall) {
  const $wrap = $root.getElementsByClassName(apiCall.name)[0]
  $wrap.classList.remove(...cls)
  $wrap.classList.add(apiCall.status)
}

function printApiStocksInPage (apiCall) {
  if (apiCall.stocks) {
    const $wrap = $root.getElementsByClassName(apiCall.name)[0]
    const $ul = $wrap.getElementsByTagName('ul')[0]
    for (const a of apiCall.stocks) {
      const $li = document.createElement('li')
      const $a = document.createElement('a')
      $a.innerText = a.name
      $a.title = a.name
      $a.href = `/analisi/${encodeURI(a.name.toLowerCase())}?isin=${a.isin}`
      const $span = document.createElement('span')
      $span.innerText = a[apiCall.key].value
      $li.appendChild($a)
      $li.appendChild($span)
      $ul.appendChild($li)
    }
    $wrap.appendChild($ul)
  }
}

const apiList = {
  init: async (apis) => {
    $root = document.getElementById('api_list')
    cls = ['idle', 'loading', 'success', 'error']

    await callTheApi(apis)
  }
}

export default apiList
