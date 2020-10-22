#!/usr/bin/env node
'use strict';

const proxy = require('..')({ host: 'localhost', port: 8006 });

proxy.listen(8015);

