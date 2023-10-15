/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const packageJson = require('./package.json')
const version = packageJson.version

const envContent = `VERSION=${version}\n`
fs.writeFileSync('./.env', envContent)
