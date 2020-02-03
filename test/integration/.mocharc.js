const path = require('path');

module.exports = {
  spec: path.join(__dirname, './tests'),
  recursive: true,
  timeout: 10000,
  exit: true,
};
