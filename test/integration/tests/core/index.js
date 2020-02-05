const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const { app } = require('../../../../src/index.server');

const expect = chai.expect;
chai.use(chaiHttp);
const agent = () => chai.request(app.getExpressApp());

module.exports = {
  faker,
  expect,
  agent,
};
