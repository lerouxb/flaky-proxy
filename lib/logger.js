'use strict';

const internals = {};


internals.log = function (...params) {

    console.log(new Date(), ...params);
};


exports.listening = function (port) {

    internals.log(`Listening on port ${port}`);
};


exports.disconnecting = function () {

    internals.log('Disconnecting');
};


exports.alreadyDisconnected = function () {

    internals.log('Already disconnected');
};


exports.connecting = function () {

    internals.log('Connecting');
};


exports.alreadyConnected = function () {

    internals.log('Already connected');
};


exports.disconnectingSocket = function (socket) {

    internals.log('Disconnecting a socket');
};


exports.delayingConnection = function (req, socket, head) {

    internals.log('Delaying a connection until we allow connections again');
};


exports.delayedConnection = function (req, socket, head) {

    internals.log('Allowing a waiting connection to connect');
};


exports.open = function (socket) {

    internals.log('Adding socket');
};


exports.close = function (res, socket, head) {

    internals.log('Removing socket');
};


exports.proxyReq = function (proxyReq, req, res, options) {
};


exports.proxyRes = function (proxyRes, req, res) {
};


exports.proxyReqWs = function (proxyReq, req, socket, options, head) {
};
