import axios from 'axios';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import cors from 'cors';
import express from 'express';

const ERROR_STATUS_CODE = 500;

function pipeFirstResponseToSecondResponse(res1, res2, { origin }) {
    const accessControlAllowOriginHeader = res1.headers['access-control-allow-origin'];
    if (accessControlAllowOriginHeader && accessControlAllowOriginHeader !== origin) {
        console.log(
            chalk.blue(
                `Override access-control-allow-origin header from proxified URL : ${chalk.green(
                    accessControlAllowOriginHeader
                )}\n`
            )
        );
        res1.headers['access-control-allow-origin'] = origin;
    }
    Object.entries(res1.headers).forEach(([key, value]) => {
        res2.setHeader(key, value);
    });

    res2.statusCode = res1.status;
    res1.data.pipe(res2);
}

function welcomeMessage({ proxyUrl, port, credentials, origin, proxyPartial }) {
    // Welcome Message
    console.log(chalk.bgGreen.black.bold.underline('\n Proxy Active \n'));
    console.log(chalk.blue(`Proxy Url: ${chalk.green(proxyUrl)}`));
    console.log(chalk.blue(`Proxy Partial: ${chalk.green(proxyPartial)}`));
    console.log(chalk.blue(`PORT: ${chalk.green(port)}`));
    console.log(chalk.blue(`Credentials: ${chalk.green(credentials)}`));
    console.log(chalk.blue(`Origin: ${chalk.green(origin)}\n`));
    console.log(
        chalk.cyan(
            `To start using the proxy simply replace the proxied part of your url with: ${chalk.bold(
                `http://localhost:${port}/${proxyPartial}\n`
            )}`
        )
    );
}

export function startProxy({ port, proxyUrl, proxyPartial, credentials, origin }) {
    const proxy = express();
    proxy.use(cors({ credentials, origin }));
    proxy.use(bodyParser.json());
    proxy.options('*', cors({ credentials, origin }));

    // Remove trailing slash
    const cleanProxyUrl = proxyUrl.replace(/\/$/u, '');
    // Remove all forward slashes
    const cleanProxyPartial = proxyPartial.replace(/\//gu, '');

    proxy.use(`/${cleanProxyPartial}`, (req, res) => {
        console.log(chalk.green(`Request Proxied -> ${req.url}`));

        const axiosConfig = {
            method: req.method.toLowerCase(),
            url: cleanProxyUrl + req.url,
            responseType: 'stream',
            headers: { ...req.headers, host: undefined, 'content-length': undefined },
            data: req.body,
        };

        axios(axiosConfig)
            .then((response) => {
                pipeFirstResponseToSecondResponse(response, res, { origin });
            })
            .catch((error) => {
                if (error.response) {
                    pipeFirstResponseToSecondResponse(error.response, res, { origin });
                } else {
                    throw new Error(`Error in proxy server: ${error.message}`);
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(ERROR_STATUS_CODE).send('Internal server error in the proxy server');
            });
    });

    proxy.listen(port);

    welcomeMessage({ proxyUrl: cleanProxyUrl, proxyPartial: cleanProxyPartial, origin, credentials, port });
}
