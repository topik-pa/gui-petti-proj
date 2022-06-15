let $root, cls, aggregators

function setAggregatorValue (aggregator) {
  let value = 0
  // const length = aggregator.stocks.length
  let length = 0
  if (aggregator.name === 'tendency') {
    let tendencyUpCount = 0
    for (const stock of aggregator.stocks) {
      if (stock.sol24_shortTendency.value === 'Rialzo') {
        tendencyUpCount++
      }
    }
    aggregator.value = (aggregator.stocks.length / tendencyUpCount).toFixed(2)
  } else {
    for (const stock of aggregator.stocks) {
      let aggrValue = stock[aggregator.name].value
      if (!aggrValue) {
        continue
      }
      if (typeof aggrValue === 'string') {
        aggrValue = parseInt(aggrValue.replace(',', '.').replace('%', ''))
      }
      length++
      value += aggrValue
    }
    aggregator.value = (value / length).toFixed(2)
  }
}
function printAggregatorValue (aggregator) {
  const $aggregator = $root.querySelector(`.${aggregator.class}`)
  const $gauge = $aggregator.querySelector('img')
  const $value = $aggregator.querySelector('span')
  $gauge.src = aggregator.iconValue
  $value.innerText = aggregator.value
  $aggregator.classList.remove(...cls)
  $aggregator.classList.add('success')
}

const aggregator = {
  init: (apiListWStocks) => {
    $root = document.getElementById('aggregator')
    cls = ['idle', 'loading', 'success', 'error']
    aggregators = {
      performance: {
        id: 0,
        name: 'perf1M',
        class: 'performance',
        stocks: undefined,
        value: undefined,
        get iconValue () {
          let iconValue
          switch (true) {
          case (this.value > 14):
            iconValue = 5
            break
          case (this.value > 7 && this.value <= 14):
            iconValue = 4
            break
          case (this.value >= 0 && this.value <= 7):
            iconValue = 3
            break
          case (this.value < 0 && this.value >= -7):
            iconValue = 2
            break
          case (this.value < -7 && this.value >= -14):
            iconValue = 1
            break
          case (this.value < -14):
            iconValue = 0
            break
          default:
            iconValue = ''
            break
          }
          return `/assets/images/gauge/gauge_${iconValue}-min.png`
        }
      },
      volatility: {
        id: 1,
        name: 'volatility',
        class: 'volatility',
        stocks: undefined,
        value: undefined,
        get iconValue () {
          let iconValue
          switch (true) {
          case (this.value > 70):
            iconValue = 0
            break
          case (this.value > 56):
            iconValue = 1
            break
          case (this.value > 44):
            iconValue = 2
            break
          case (this.value > 32):
            iconValue = 3
            break
          case (this.value > 20):
            iconValue = 4
            break
          default:
            iconValue = 5
            break
          }
          return `/assets/images/gauge/gauge_${iconValue}-min.png`
        }
      },
      tendency: {
        id: 2,
        name: 'tendency',
        class: 'tendency',
        stocks: undefined,
        value: undefined,
        get iconValue () {
          let iconValue
          switch (true) {
          case (this.value < 1.2):
            iconValue = 5
            break
          case (this.value < 1.7):
            iconValue = 4
            break
          case (this.value < 2.5):
            iconValue = 3
            break
          case (this.value < 3.8):
            iconValue = 2
            break
          case (this.value < 5.9):
            iconValue = 1
            break
          default:
            iconValue = 0
            break
          }
          return `/assets/images/gauge/gauge_${iconValue}-min.png`
        }
      }
    }

    // Populate the local stocks
    for (const api of apiListWStocks) {
      if (api.name === 'perf1M') {
        aggregators.performance.stocks = api.stocks
      }
      if (api.name === 'volatility') {
        aggregators.volatility.stocks = api.stocks
      }
      if (api.name === 'shortTendency') {
        aggregators.tendency.stocks = api.stocks
      }
    }

    //
    setAggregatorValue(aggregators.performance)
    setAggregatorValue(aggregators.volatility)
    setAggregatorValue(aggregators.tendency)
    //
    printAggregatorValue(aggregators.performance)
    printAggregatorValue(aggregators.volatility)
    printAggregatorValue(aggregators.tendency)
  }
}

export default aggregator
