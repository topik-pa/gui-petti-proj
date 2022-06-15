import api from '../../../scripts/api.js'
const data = {
  info: {
    status: 'idle',
    body: undefined
  },
  analysis: {
    status: 'idle',
    body: undefined
  },
  news: {
    status: 'idle',
    body: undefined
  }
}
const cls = ['idle', 'loading', 'success', 'error']
let $root, isin

async function callTheApi (type) {
  data[type].status = 'loading'
  updateUIStatus(type)
  try {
    const request = await api.get(`api/${type}/${isin}`)
    data[type].body = request.body
    data[type].status = 'success'
  } catch (error) {
    data[type].status = 'error'
    console.error(error)
  }
  updateUIStatus(type)
}

function updateUIStatus (type) {
  const $wrap = $root.getElementsByClassName(type)[0]
  $wrap.classList.remove(...cls)
  $wrap.classList.add(data[type].status)
}

function printInfoData () {
  $root.querySelector('.last-price span').innerText = data.info.body.lastPrice.value || 'nd'
  $root.querySelector('.volatility span').innerText = data.info.body.volatility?.value

  const $profile = $root.querySelector('.profile div')
  $profile.prepend(data.info.body.profile?.value)
  $profile.querySelector('a').href = data.info.body.profile?.source

  const $comment = $root.querySelector('.comment div')
  $comment.prepend(data.info.body.comment?.value)
  $comment.querySelector('a').href = data.info.body.comment?.source

  const $dividends = $root.querySelector('.dividends')
  const $divYield = $dividends.querySelector('.divYield span')
  $divYield.prepend(data.info.body.divYield?.value)
  const $divValue = $dividends.querySelector('.divValue span')
  $divValue.prepend(data.info.body.lastDiv?.value)
  const $lastDiv = $dividends.querySelector('.lastDiv span')
  $lastDiv.prepend(data.info.body.lastDivDate?.value)
  $dividends.querySelector('a').href = data.info.body.lastDivDate?.source

  const $average = $root.querySelector('.average')
  const $mm20days = $average.querySelector('.mm20 span')
  $mm20days.prepend(data.info.body.mm20days?.value)
  const $mm40days = $average.querySelector('.mm40 span')
  $mm40days.prepend(data.info.body.mm40days?.value)
  const $mm100days = $average.querySelector('.mm100 span')
  $mm100days.prepend(data.info.body.mm100days?.value)
  $average.querySelector('a').href = data.info.body.mm20days?.source

  const $minmax = $root.querySelector('.minmax')
  const $absMax = $minmax.querySelector('.absMax span')
  $absMax.prepend(data.info.body.absMax?.value)
  const $absMin = $minmax.querySelector('.absMin span')
  $absMin.prepend(data.info.body.absMin?.value)
  const $max = $minmax.querySelector('.max span')
  $max.prepend(data.info.body.currentYearMax?.value)
  const $min = $minmax.querySelector('.min span')
  $min.prepend(data.info.body.currentYearMin?.value)
  $minmax.querySelector('a').href = data.info.body.absMax?.source

  const $performance = $root.querySelector('.performance')
  const $perf1M = $performance.querySelector('.perf1M span')
  $perf1M.prepend(data.info.body.perf1M?.value)
  const $perf6M = $performance.querySelector('.perf6M span')
  $perf6M.prepend(data.info.body.perf6M?.value)
  const $perf1Y = $performance.querySelector('.perf1Y span')
  $perf1Y.prepend(data.info.body.perf1Y?.value)
  $performance.querySelector('a').href = data.info.body.perf1M?.source
}

function printAnalysisData () {
  const $analysis = $root.querySelector('.analysis')
  const $borsaItaliana = $analysis.querySelector('.borsa-italiana-logo')
  $borsaItaliana.querySelector('a').href = data.analysis.body.borsaIt_resistance?.source
  $borsaItaliana.querySelector('.resistance span').innerText = data.analysis.body.borsaIt_resistance?.value
  $borsaItaliana.querySelector('.support span').innerText = data.analysis.body.borsaIt_support?.value
  $borsaItaliana.querySelector('.rsi span').innerText = data.analysis.body.borsaIt_rsi?.value
  $borsaItaliana.querySelector('.evaluation span').innerText = data.analysis.body.borsaIt_evaluation?.value
  $borsaItaliana.querySelector('.rating span').innerText = data.analysis.body.borsaIt_rating?.value

  const $ilSole24Ore = $analysis.querySelector('.il-sole-24-ore-logo')
  $ilSole24Ore.querySelector('a').href = data.analysis.body.sol24_shortTendency?.source
  $ilSole24Ore.querySelector('.short-tend span').innerText = data.analysis.body.sol24_shortTendency?.value
  $ilSole24Ore.querySelector('.med-tend span').innerText = data.analysis.body.sol24_mediumTendency?.value

  const $mf = $analysis.querySelector('.milano-finanza-logo')
  $mf.querySelector('a').href = data.analysis.body.milFin_mfRanking?.source
  $mf.querySelector('.rating span').innerText = data.analysis.body.milFin_mfRanking?.value
  $mf.querySelector('.risk span').innerText = data.analysis.body.milFin_mfRisk?.value
  $mf.querySelector('.rsi span').innerText = data.analysis.body.milFin_mfRsi?.value

  const $sol = $analysis.querySelector('.soldi-on-line-logo')
  $sol.querySelector('a').href = data.analysis.body.sol_lastTargetPrice?.source
  $sol.querySelector('.target span').innerText = data.analysis.body.sol_lastTargetPrice?.value
  $sol.querySelector('.evaluation span').innerText = data.analysis.body.sol_lastJudgment?.value

  const $teleborsa = $analysis.querySelector('.teleborsa-logo')
  $teleborsa.querySelector('a').href = data.analysis.body.teleb_tbResistance?.source
  $teleborsa.querySelector('.resistance span').innerText = data.analysis.body.teleb_tbResistance?.value
  $teleborsa.querySelector('.support span').innerText = data.analysis.body.teleb_tbSupport?.value
  $teleborsa.querySelector('.trend span').innerText = data.analysis.body.teleb_trend?.value
}

function printNewsData () {
  const $press = $root.querySelector('.news')
  const $ul = $press.getElementsByTagName('ul')[0]
  for (const item of data.news.body) {
    const $li = document.createElement('li')
    const $a = document.createElement('a')
    $a.innerText = item.title
    $a.title = item.title
    $a.href = item.url
    $a.target = '_blank'
    $a.rel = 'noopener noreferrer'
    $li.appendChild($a)
    $ul.appendChild($li)
  }
}

const stockInfo = {
  init: async () => {
    isin = new URLSearchParams(window.location.search).get('isin') || window.location.pathname.replace('/stock/', '')
    $root = document.getElementById('stock_info')
    if (isin) {
      await callTheApi('info')
      if (data.info.status === 'success') {
        printInfoData()
      }
      await callTheApi('analysis')
      if (data.analysis.status === 'success') {
        printAnalysisData()
      }
      await callTheApi('news')
      if (data.news.status === 'success') {
        printNewsData()
      }
      if (data.info.status === 'success' && data.analysis.status === 'success') {
        return data
      }
    }
  }
}

export default stockInfo
