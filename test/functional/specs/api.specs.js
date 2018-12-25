const test = require('narval')

const utils = require('./utils')

test.describe('switch api', function () {
  this.timeout(10000)
  let connection

  test.before(() => {
    connection = new utils.Connection()
  })

  test.describe('switch state', () => {
    test.it('should return false', () => {
      return connection.request('/abilities/switch/state', {
        method: 'GET'
      }).then(response => {
        return Promise.all([
          test.expect(response.statusCode).to.equal(200),
          test.expect(response.body).to.deep.equal({
            data: false
          })
        ])
      })
    })
  })

  test.describe('switch action', () => {
    test.it('should do nothing if target status is equal to current status', () => {
      return connection.request('/abilities/switch/action', {
        method: 'POST',
        body: {
          data: false
        }
      }).then(response => {
        return utils.moduleLogs()
          .then(logs => {
            return Promise.all([
              test.expect(logs).to.not.contain('Setting gpio 2 to false'),
              test.expect(logs).to.not.contain('Setting gpio 3 to false'),
              test.expect(response.statusCode).to.equal(200),
              test.expect(response.body).to.deep.equal({
                data: false
              })
            ])
          })
      })
    })

    test.it('should change relays status if target status is different to current status', () => {
      return connection.request('/abilities/switch/action', {
        method: 'POST',
        body: {
          data: true
        }
      }).then(response => {
        return utils.moduleLogs()
          .then(logs => {
            return Promise.all([
              test.expect(logs).to.contain('Setting gpio 2 to false'),
              test.expect(logs).to.contain('Setting gpio 3 to false'),
              test.expect(response.statusCode).to.equal(200),
              test.expect(response.body).to.deep.equal({
                data: true
              })
            ])
          })
      })
    })
  })
})
