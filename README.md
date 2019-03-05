# Relays Switch Domapic Module

> Domapic module that handles a 4 way switch made with relays. Includes a gpio-in sensor to determine status.

[![Build status][travisci-image]][travisci-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Quality Gate][quality-gate-image]][quality-gate-url] [![js-standard-style][standard-image]][standard-url]

[![NPM dependencies][npm-dependencies-image]][npm-dependencies-url] [![Last commit][last-commit-image]][last-commit-url] [![Last release][release-image]][release-url]

[![NPM downloads][npm-downloads-image]][npm-downloads-url] [![License][license-image]][license-url]

---

## Intro

This package starts a Domapic Module that handles a 3 or 4 way switch made with relays. It is intended to be used in a Raspberry Pi or any other system supporting the [onoff][onoff-url] library, such as C.H.I.P. or BeagleBone.

The status of the switch is determined by the status of a sensor (a light sensor, for example) handled by the module too.

It can be integred into a traditional analogic switches circuit, and will act as another analogic switch in the system. In that way, standard switches will continue working, and, as an extra, you'll can control the lights through Domapic Controller, Siri, etc.

![Relays switch connection schema][relays-switch-schema-image]

> Above, example of connections for the module acting as a 4 way switch.

It can be used alone, but also can be connected to a [Domapic Controller][domapic-controller-url] to get the most out of it.

## Installation

```bash
npm i relays-switch-domapic-module -g
```

## Usage

```bash
relays-switch start --relayGpio1=2 --relayGpio1=3 --sensorGpio=17 --invert --save
```

The module will be started in background using [pm2][pm2-url].

To display logs, type:

```bash
relays-switch logs #--lines=300
```

## Options

The module, apart of all common [domapic services options][domapic-service-options-url], provides custom options for configuring the switch:

* `ways` - `<number>` Define if module will act as a 3 or 4 way switch. Valid values are `3` and `4`.
* `relayGpio1` - `<number>` Gpio number for first relay.
* `relayGpio2` - `<number>` Gpio number for second relay. Mandatory when module is configured to act as a 4 way switch.
* `sensorGpio` - `<number>` Gpio number for the sensor that will determine the switch status.
* `debounce` - `<number>` Time in miliseconds to wait for before notifying a change in the status of the sensor. Default is 500.
* `invert` - `<boolean>` If `true`, the value of the sensor will be inverted when emitting event or returning state. Default is `false`. (`reverse` is an alias for this option)
* `invertRelays` - `<boolean>`  If `true`, the values read from or written to the relays GPIOs will be inverted. Equivalent to `activeLow` option of the [onoff][onoff-url] library.

## Connection with Domapic Controller

Connect the module with a Domapic Controller providing the Controller url and connection token (you'll find it the Controller logs when it is started):

```bash
relays-switch start --controller=http://192.168.1.110:3000 --controllerApiKey=fo--controller-api-key
```

Now, the module can be controlled through the Controller interface, or installed plugins.

## Stand alone usage

Domapic modules are intended to be used through Domapic Controller, but can be used as an stand-alone service as well. Follow next instructions to use the built-in api by your own:

### Rest API

When the server is started, you can browse to the provided Swagger interface to get all the info about the api resources.  Apart of all api methods common to all [Domapic Services][domapic-service-url] the module provides two [_Domapic Abilities_][domapic-service-abilities-url] for getting the state of the switch and toggle it, which generates two extra API resources:

* `/api/abilities/switch/state` - Returns the current status of the sensor.
* `/api/abilities/switch/action` - Changes the switch status to make the sensor match with the provided value.
* `/api/abilities/relays-switch/state` - Returns the current status of the relays.
* `/api/abilities/relays-switch/action` - Changes the relays status.

### Authentication

The server includes the [Domapic Services][domapic-service-url] authentication method, which is disabled by default for `127.0.0.1`.
You can disable the authentication using the `--authDisabled` option (not recommended if your server is being exposed to the Internet). Read more about [available options in the domapic services documentation][domapic-service-options-url].

If you want to authenticate when requesting from another IPs, look for the api key automatically generated and intended to be used by Domapic Controller when the server is started. You'll find it in the server logs:

```
-----------------------------------------------------------------
Try adding connection from Controller, using the next service Api Key: HMl6GHWr7foowxM40CB6tQPuXt3zc7zE
-----------------------------------------------------------------
```

To make your own requests to the api, provide this token using the `X-Api-Key` header.

Use the mentioned api key also for authenticating when using the Swagger interface.

## Alternative command line methods

### Not global installation

If the package is not installed globally, you can replace the `relays-switch` command in examples above by `npm run relays-switch --` (commands must be executed inside the package folder in that case)

### Not background mode

If you don't want to use the built-in background runner, you can start the server directly, attaching logs to current `stdout`. Move to the package folder and replace the `relays-switch` command of examples above by `node server.js`. Press `CTRL+C` to stop the server.


[coveralls-image]: https://coveralls.io/repos/github/javierbrea/relays-switch-domapic-module/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/javierbrea/relays-switch-domapic-module
[travisci-image]: https://travis-ci.com/javierbrea/relays-switch-domapic-module.svg?branch=master
[travisci-url]: https://travis-ci.com/javierbrea/relays-switch-domapic-module
[last-commit-image]: https://img.shields.io/github/last-commit/javierbrea/relays-switch-domapic-module.svg
[last-commit-url]: https://github.com/javierbrea/relays-switch-domapic-module/commits
[license-image]: https://img.shields.io/npm/l/relays-switch-domapic-module.svg
[license-url]: https://github.com/javierbrea/relays-switch-domapic-module/blob/master/LICENSE
[npm-downloads-image]: https://img.shields.io/npm/dm/relays-switch-domapic-module.svg
[npm-downloads-url]: https://www.npmjs.com/package/relays-switch-domapic-module
[npm-dependencies-image]: https://img.shields.io/david/javierbrea/relays-switch-domapic-module.svg
[npm-dependencies-url]: https://david-dm.org/javierbrea/relays-switch-domapic-module
[quality-gate-image]: https://sonarcloud.io/api/project_badges/measure?project=relays-switch-domapic-module&metric=alert_status
[quality-gate-url]: https://sonarcloud.io/dashboard?id=relays-switch-domapic-module
[release-image]: https://img.shields.io/github/release-date/javierbrea/relays-switch-domapic-module.svg
[release-url]: https://github.com/javierbrea/relays-switch-domapic-module/releases
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/

[onoff-url]: https://www.npmjs.com/package/onoff
[domapic-controller-url]: https://www.npmjs.com/package/domapic-controller
[domapic-service-options-url]: https://github.com/domapic/domapic-service#options
[domapic-service-abilities-url]: https://github.com/domapic/domapic-service#abilities
[domapic-service-url]: https://github.com/domapic/domapic-service
[pm2-url]: http://pm2.keymetrics.io/

[relays-switch-schema-image]: http://domapic.com/assets/relays-switch/fritzing_schema.png

