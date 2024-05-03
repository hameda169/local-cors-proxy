#!/usr/bin/env node

import { hideBin } from 'yargs/helpers';
import { startProxy } from '../lib/index.js';
import yargs from 'yargs/yargs';

try {
    const options = yargs(hideBin(process.argv))
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
                return Array.isArray(arg) ? arg.pop() : arg;
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

    startProxy({
        port: options.port,
        proxyUrl: options.proxyUrl,
        proxyPartial: options.proxyPartial,
        credentials: options.credentials,
        origin: options.origin,
    });
} catch (error) {
    console.error(error);
}
