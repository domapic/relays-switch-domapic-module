const test = require('narval')

const utils = require('./utils')

test.describe('switch api', function () {
  this.timeout(10000)
  let connection

  test.before(() => {
    connection = new utils.Connection()
  })

  test.describe('switch state reverse', () => {
    test.it('should return true', () => {
      return connection.request('/abilities/switch/state', {
        method: 'GET'
      }).then(response => {
        return Promise.all([
          test.expect(response.statusCode).to.equal(200),
          test.expect(response.body).to.deep.equal({
            data: true
          })
        ])
      })
    })
  })

  test.describe('switch action when ways are 3', () => {
    test.it('should do nothing if target status is equal to current status', () => {
      return connection.request('/abilities/switch/action', {
        method: 'POST',
        body: {
          data: true
        }
      }).then(response => {
        return utils.moduleLogs()
          .then(logs => {
            return Promise.all([
              test.expect(logs).to.not.contain('Setting gpio 5 to false'),
              test.expect(response.statusCode).to.equal(200),
              test.expect(response.body).to.deep.equal({
                data: true
              })
            ])
          })
      })
    })

    test.it('should change relay status if target status is different to current status', () => {
      return connection.request('/abilities/switch/action', {
        method: 'POST',
        body: {
          data: false
        }
      }).then(response => {
        return utils.moduleLogs()
          .then(logs => {
            return Promise.all([
              test.expect(logs).to.contain('Setting gpio 5 to false'),
              test.expect(response.statusCode).to.equal(200),
              test.expect(response.body).to.deep.equal({
                data: false
              })
            ])
          })
      })
    })
  })
})
