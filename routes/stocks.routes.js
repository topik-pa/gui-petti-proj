module.exports = app => {
  const stocks = require('../controllers/stocks.controller.js')
  const router = require('express').Router()

  // GET stocks list
  // router.get('/', stocks.getStocksList)

  // GET performance stocks list
  router.get('/stocks/perf1M', stocks.getStocksList)
  router.get('/stocks/perf6M', stocks.getStocksList)
  router.get('/stocks/perf1Y', stocks.getStocksList)

  // GET volatility, rsi, short tend stocks list
  router.get('/stocks/volatility', stocks.getStocksList)
  router.get('/stocks/mfRsi', stocks.getStocksList)
  router.get('/stocks/shortTendency', stocks.getStocksList)

  // GET dividend and judgment
  router.get('/stocks/divYield', stocks.getStocksList)
  router.get('/stocks/lastJudgment', stocks.getStocksList)

  // GET ratings, med tendency and rsi stocks list
  router.get('/stocks/rating', stocks.getStocksList)
  router.get('/stocks/mfRanking', stocks.getStocksList)
  router.get('/stocks/mediumTendency', stocks.getStocksList)
  router.get('/stocks/rsi', stocks.getStocksList)

  //
  router.get('/info/:isin', stocks.getStocksList)
  router.get('/analysis/:isin', stocks.getStocksList)
  router.get('/news/:isin', stocks.getStocksList)

  app.use('/api', router)
}
