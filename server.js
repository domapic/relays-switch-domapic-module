'use strict'

const path = require('path')

const domapic = require('domapic-service')
const gpioIn = require('gpio-in-domapic')
const gpioOut = require('gpio-out-domapic')

const pluginConfigs = require('./lib/plugins.json')

const options = require('./lib/options')
const {
  ABILITY_NAME,
  RELAYS_ABILITY_NAME,
  WAYS_OPTION,
  RELAY_GPIO_1_OPTION,
  RELAY_GPIO_2_OPTION,
  SENSOR_GPIO_OPTION,
  DEBOUNCE_OPTION,
  REVERSE_STATE_OPTION,
  INVERT_RELAYS_OPTION
} = require('./lib/statics')

domapic.createModule({
  packagePath: path.resolve(__dirname),
  customConfig: options
}).then(async dmpcModule => {
  const config = await dmpcModule.config.get()
  const reverse = config[REVERSE_STATE_OPTION]
  const ways = config[WAYS_OPTION]

  const statusSensor = new gpioIn.Gpio(dmpcModule, {
  }, {
    gpio: SENSOR_GPIO_OPTION,
    debounceTimeout: DEBOUNCE_OPTION
  })
  const relay1 = new gpioOut.Gpio(dmpcModule, {
    initialStatus: true,
    rememberLastStatus: true
  }, {
    gpio: RELAY_GPIO_1_OPTION,
    invert: INVERT_RELAYS_OPTION
  })
  let relay2 = null
  if (ways === 4) {
    if (!config[RELAY_GPIO_2_OPTION]) {
      throw new Error('Please define a gpio for second relay')
    }
    relay2 = new gpioOut.Gpio(dmpcModule, {
      initialStatus: true,
      rememberLastStatus: true
    }, {
      gpio: RELAY_GPIO_2_OPTION,
      invert: INVERT_RELAYS_OPTION
    })
  }

  const statusSensorValue = value => reverse ? !value : value

  const toggleSwitch = async () => {
    const targetStatus = !relay1.status
    await relay1.setStatus(targetStatus)
    if (relay2) {
      await relay2.setStatus(targetStatus)
    }
    dmpcModule.events.emit(RELAYS_ABILITY_NAME, targetStatus)
  }

  await dmpcModule.register({
    [ABILITY_NAME]: {
      description: 'Switch with status sensor',
      data: {
        type: 'boolean'
      },
      action: {
        description: 'Change switch position to make sensor match with desired status',
        handler: async newState => {
          if (statusSensorValue(statusSensor.status) !== newState) {
            await toggleSwitch()
          }
          return newState
        }
      },
      state: {
        description: 'Sensor status',
        handler: () => statusSensorValue(statusSensor.status)
      },
      event: {
        description: 'Sensor has changed status'
      }
    },
    [RELAYS_ABILITY_NAME]: {
      description: 'Relays status',
      data: {
        type: 'boolean'
      },
      action: {
        description: 'Switch relays',
        handler: async newState => {
          await relay1.setStatus(newState)
          if (relay2) {
            await relay2.setStatus(newState)
          }
          dmpcModule.events.emit(RELAYS_ABILITY_NAME, newState)
          return newState
        }
      },
      state: {
        description: 'Current relays status',
        handler: () => relay1.status
      },
      event: {
        description: 'Relays have changed status'
      }
    }
  })

  await dmpcModule.addPluginConfig(pluginConfigs)
  await statusSensor.init()
  await relay1.init()
  if (relay2) {
    await relay2.init()
  }

  statusSensor.events.on(gpioIn.Gpio.eventNames.CHANGE, newValue => {
    const value = statusSensorValue(newValue)
    dmpcModule.tracer.debug('Sensor has changed status', value)
    dmpcModule.events.emit(ABILITY_NAME, value)
  })

  return dmpcModule.start()
})
