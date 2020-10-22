'use strict';

const _ = require('lodash');

const Http = require('http');
const HttpProxy = require('http-proxy');

const Logger = require('./logger');

const internals = {};


module.exports = function (target) {

    const sockets = [];
    let allowConnections = false;
    const waiting = [];

    const logger = Logger; // just alias to a local var for now. might become Logger() or new Logger();

    const proxy = new HttpProxy.createProxyServer({ target });

    const proxyServer = Http.createServer((req, res) => {

        const { method, url } = req;

        if (method === 'POST') {
            if (url === '/disconnect-sockets') {
                if (allowConnections) {
                    logger.disconnecting();

                    allowConnections = false;

                    while (sockets.length) {
                        const socket = sockets.shift();
                        logger.disconnectingSocket(socket);
                        socket.destroy();
                    }
                }
                else {
                    logger.alreadyDisconnected();
                }

                return internals.ok(res);
            }

            if (url === '/reconnect-sockets') {
                if (allowConnections) {
                    logger.alreadyConnected();
                }
                else {
                    logger.connecting();

                    allowConnections = true;

                    while (waiting.length) {
                        const params = waiting.shift();
                        logger.delayedConnection(...params);
                        proxy.ws(...params);
                    }
                }

                return internals.ok(res);
            }
        }

        // proxy everything that is not an internally handled route
        proxy.web(req, res);
    });

    proxyServer.on('upgrade', (...params) => {

        if (allowConnections) {
            proxy.ws(...params);
        }
        else {
            // we'll respond once we reconnect again
            logger.delayingConnection(params);
            waiting.push(params);
        }
    });

    proxy.on('open', (socket) =>  {

        logger.open(socket);

        sockets.push(socket);
    });

    proxy.on('close', (res, socket, head) => {

        logger.close(res, socket, head);

        const index = sockets.indexOf(socket);
        if (index !== -1) {
            sockets.splice(index, 1);
        }
    });

    // looks like http-proxy uses the same event name for different things and
    // the res parameter could be a socket and the callback could have a 4th
    // url param
    proxy.on('error', (err, req, res) => {

        internals.ignore(err);

        // crude check to make sure res is not a socket
        if (res.writeHead) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });

            res.end('Something went wrong. And we are reporting a custom error message.');
        }
    });

    proxy.on('proxyReq', logger.proxyReq);
    proxy.on('proxyRes', logger.proxyRes);
    proxy.on('proxyReqWs', logger.proxyReqWs);

    const api = {

        listen: _.once((port) => {

            proxyServer.listen(port);
            Logger.listening(port);
            allowConnections = true;
        })
    };

    return api;
};


internals.ok = function (res) {

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
};

internals.ignore = function () {
};
