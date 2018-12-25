#!/usr/bin/env bash

npm run relays-switch start -- --path=${domapic_path} ${service_extra_options}
npm run relays-switch logs
