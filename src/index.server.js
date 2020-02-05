// Feature imports
require('./server/wallet');

// Core import
const { app } = require('./server/core');

app.start();

module.exports = { app };
