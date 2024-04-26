#!/usr/bin/env node

var lcp = require('../lib/index.js');
var yargs = require('yargs/yargs')
var { hideBin } = require('yargs/helpers')

try {
  var options = yargs(hideBin(process.argv))
      .option('port', {
        describe: 'Provide the port option',
        type: 'number',
        alias: 'p',
        default: 8010,
      })
      .option('proxyPartial', {
        describe: 'Provide the proxyPartial option',
        type: 'string',
        default: '/proxy',
      })
      .option('proxyUrl', {
        describe: 'Provide the proxyUrl option',
        type: 'string',
        demandOption: true,
        coerce: (arg) => {
          // If multiple values are passed, return the last one
          return Array.isArray(arg) ? arg[arg.length - 1] : arg;
        },
      })
      .option('credentials', {
        describe: 'Provide the credentials option',
        type: 'boolean',
        default: false,
      })
      .option('origin', {
        describe: 'Provide the origin option',
        type: 'string',
        default: '*',
      })
      .parse();

  lcp.startProxy(options.port, options.proxyUrl, options.proxyPartial, options.credentials, options.origin);
} catch (error) {
  console.error(error);
}
