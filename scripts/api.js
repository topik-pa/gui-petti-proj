const api = {
  get: async (path = '/api/') => {
    const formattedResp = {}
    const params = {
      method: 'GET'
    }
    await fetch(window.location.origin + '/' + path, params)
      .then(resp => {
        formattedResp.status = resp.status
        return resp.json()
      })
      .then(data => { formattedResp.body = data })
      .catch((err) => { console.error(err) })
    return formattedResp
  },
  post: async (data = {}, path = '/api/') => {
    const formattedResp = {}
    const params = {
      method: 'POST',
      body: JSON.stringify(data)
    }
    await fetch(window.location.origin + '/' + path, params)
      .then(resp => {
        formattedResp.status = resp.status
        return resp.json()
      })
      .then(data => { formattedResp.body = data })
      .catch((err) => { console.error(err) })
    return formattedResp
  }
}

export default api
