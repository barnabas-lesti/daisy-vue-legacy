const path = require('path');
const { config } = require('@barnabas-lesti/aurora/server');

config(path.join(__dirname, '../../env'));
module.exports = config;
