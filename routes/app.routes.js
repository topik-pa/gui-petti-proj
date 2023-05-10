module.exports = app => {
  app.get('/', (req, res) => {
    res.render('index', { id: 'home', title: 'Home', url: req.url })
  })
  app.get('*', function (req, res) {
    res.render('404/404', { id: 'err404', title: 'Error 404' })
  })
}
