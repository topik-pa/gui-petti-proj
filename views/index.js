import stocksList from '../components/index/stocks_list/stocks_list.js'
import apiList from '../components/index/api_list/api_list.js'
import aggregator from '../components/index/aggregator/aggregator.js'
import filters from '../components/index/filters/filters.js'

const api = JSON.parse(sessionStorage.getItem('localapi')) || [
  {
    category: 'api',
    name: 'perf1M',
    key: 'perf1M',
    qp: 'order=desc',
    stocks: undefined,
    status: 'idle'
  },
  {
    category: 'api',
    name: 'perf6M',
    key: 'perf6M',
    qp: 'order=desc',
    stocks: undefined,
    status: 'idle'
  },
  {
    category: 'api',
    name: 'perf1Y',
    key: 'perf1Y',
    qp: 'order=desc',
    stocks: undefined,
    status: 'idle'
  },
  {
    category: 'api',
    name: 'volatility',
    key: 'volatility',
    qp: 'order=desc',
    stocks: undefined,
    status: 'idle'
  },
  {
    category: 'api',
    name: 'mfRsi',
    key: 'milFin_rsi',
    qp: 'order=desc',
    stocks: undefined,
    status: 'idle'
  },
  {
    category: 'api',
    name: 'shortTendency',
    key: 'sol24_shortTendency',
    qp: 'order=asc',
    stocks: undefined,
    status: 'idle'
  },
  {
    category: 'api',
    name: 'divYield',
    key: 'divYield',
    qp: 'order=desc',
    stocks: undefined,
    status: 'idle'
  },
  {
    category: 'api',
    name: 'lastJudgment',
    key: 'lastJudgment',
    qp: '',
    stocks: undefined,
    status: 'idle'
  },
  {
    category: 'filters',
    name: 'rating',
    key: 'borsaIt_rating',
    qp: 'order=desc',
    stocks: undefined,
    status: 'idle'
  },
  {
    category: 'filters',
    name: 'mfRanking',
    key: 'milFin_mfRanking',
    qp: 'order=asc',
    stocks: undefined,
    status: 'idle'
  },
  {
    category: 'filters',
    name: 'mediumTendency',
    key: 'sol24_mediumTendency',
    qp: 'order=asc',
    stocks: undefined,
    status: 'idle'
  },
  {
    category: 'filters',
    name: 'rsi',
    key: 'borsaIt_rsi',
    qp: 'order=desc',
    stocks: undefined,
    status: 'idle'
  }
]

const index = {
  init: async () => {
    stocksList.init()
    await apiList.init(api)
    aggregator.init(api)
    await filters.init(api)
    sessionStorage.setItem('localapi', JSON.stringify(api))
  }
}

export default index
