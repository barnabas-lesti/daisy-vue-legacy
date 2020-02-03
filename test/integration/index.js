const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const expect = chai.expect;
chai.use(chaiHttp);

const moduleProxy = require('./module-proxy');
// const data = require('./data');

const { app } = require('../../src/index.server');
const agent = () => chai.request(app.getExpressApp());

module.exports = {
  faker,
  expect,
  agent,
  moduleProxy,
};
