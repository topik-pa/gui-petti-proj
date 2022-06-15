let $root

function printAlerts (data) {
  const $a1 = $root.querySelector('#a1')
  const $a2 = $root.querySelector('#a2')
  const $a3 = $root.querySelector('#a3')
  const $a4 = $root.querySelector('#a4')
  const $a5 = $root.querySelector('#a5')
  const $a6 = $root.querySelector('#a6')
  const $a7 = $root.querySelector('#a7')
  const $a8 = $root.querySelector('#a8')

  const lastPrice = data.info.body.lastPrice.value
  if (!lastPrice) {
    return
  }
  if (lastPrice >= data.info.body.mm20days.value) {
    $a1.classList.remove('hide')
  } else {
    $a2.classList.remove('hide')
  }
  if (lastPrice >= data.info.body.mm40days.value) {
    $a3.classList.remove('hide')
  } else {
    $a4.classList.remove('hide')
  }

  if (lastPrice >= data.analysis.body.borsaIt_resistance.value) {
    $a5.classList.remove('hide')
  }
  if (lastPrice < data.analysis.body.borsaIt_support.value) {
    $a6.classList.remove('hide')
  }

  if (lastPrice >= data.analysis.body.teleb_tbResistance.value) {
    $a7.classList.remove('hide')
  }
  if (lastPrice < data.analysis.body.teleb_tbSupport.value) {
    $a8.classList.remove('hide')
  }
  $root.classList.add('show')
}

const stockAlerts = {
  init: async (data) => {
    $root = document.getElementById('stock_alerts')
    printAlerts(data)
  }
}

export default stockAlerts
