#!/usr/bin/env bash

npm run domapic-relays-switch start -- --path=${domapic_path} ${service_extra_options}
npm run domapic-relays-switch logs
