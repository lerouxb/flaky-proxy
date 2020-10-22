'use strict';

const proxy = require('./lib/proxy')({ host: 'localhost', port: 8006 });
proxy.listen(8015);

