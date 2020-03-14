const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../src/server');

const expect = chai.expect;
chai.use(chaiHttp);
const agent = () => chai.request(server.getApp());
server.start();

module.exports = {
  agent,
  expect,
  config: require('../../src/server/config'),
  data: require('./data'),
};
