const https = require('https')
const options = {
  hostname: 'tradingradar.p.rapidapi.com',
  port: null,
  headers: {
    'x-rapidapi-host': 'tradingradar.p.rapidapi.com',
    'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
    useQueryString: true
  }
}

// GET static stocks list
exports.getStocksList = async (req, res) => {
  options.method = 'GET'
  options.path = '/api' + req.url
  const request = https.request(options, function (response) {
    const chunks = []
    response.on('data', function (chunk) {
      chunks.push(chunk)
    })
    response.on('end', function () {
      const body = Buffer.concat(chunks)
      return res.status(response.statusCode).send(body.toString())
    })
  })
  request.on('error', error => {
    return res.status(500).send({
      code: 'serverError',
      message: error
    })
  })
  request.end()
}
