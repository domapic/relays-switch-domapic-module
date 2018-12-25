const test = require('narval')

const gpioOut = require('gpio-out-domapic')

const Mock = function () {
  let sandbox = test.sinon.createSandbox()

  const stubs = {
    init: sandbox.stub().resolves(),
    setStatus: sandbox.stub().resolves(),
    status: true
  }

  const Constructor = sandbox.stub(gpioOut, 'Gpio').callsFake(function () {
    return stubs
  })

  const restore = () => {
    sandbox.restore()
  }

  return {
    restore,
    stubs: {
      Constructor,
      instance: stubs
    }
  }
}

module.exports = Mock
