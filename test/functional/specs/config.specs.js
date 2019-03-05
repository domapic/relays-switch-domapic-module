const test = require('narval')

const utils = require('./utils')

test.describe('module configuration', function () {
  this.timeout(10000)
  let connection

  test.before(() => {
    connection = new utils.Connection()
  })

  test.it('should be exposed in config api', () => {
    return connection.request('/config', {
      method: 'GET'
    }).then(response => {
      return Promise.all([
        test.expect(response.statusCode).to.equal(200),
        test.expect(response.body.debounce).to.equal(500),
        test.expect(response.body.relayGpio1).to.equal(2),
        test.expect(response.body.relayGpio2).to.equal(3),
        test.expect(response.body.sensorGpio).to.equal(17),
        test.expect(response.body.ways).to.equal(4),
        test.expect(response.body.reverse).to.equal(false),
        test.expect(response.body.invertRelays).to.equal(false)
      ])
    })
  })
})
