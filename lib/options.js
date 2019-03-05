'use strict'

const {
  WAYS_OPTION,
  RELAY_GPIO_1_OPTION,
  RELAY_GPIO_2_OPTION,
  SENSOR_GPIO_OPTION,
  DEBOUNCE_OPTION,
  REVERSE_STATE_OPTION,
  INVERT_RELAYS_OPTION
} = require('./statics')

module.exports = {
  [WAYS_OPTION]: {
    type: 'number',
    alias: ['type'],
    describe: 'Use 3 or 4 way switch',
    choices: [3, 4],
    default: 4
  },
  [RELAY_GPIO_1_OPTION]: {
    type: 'number',
    describe: 'Set gpio number for first relay',
    demandOption: true
  },
  [RELAY_GPIO_2_OPTION]: {
    type: 'number',
    describe: 'Set gpio number for second relay'
  },
  [SENSOR_GPIO_OPTION]: {
    type: 'number',
    describe: 'Set gpio number for sensor',
    demandOption: true
  },
  [DEBOUNCE_OPTION]: {
    type: 'number',
    describe: 'Set debounce timeout for the sensor',
    default: 500
  },
  [REVERSE_STATE_OPTION]: {
    type: 'boolean',
    alias: 'invert',
    describe: 'Invert value of sensor',
    default: false
  },
  [INVERT_RELAYS_OPTION]: {
    type: 'boolean',
    describe: 'Invert value of relays',
    default: false
  }
}
