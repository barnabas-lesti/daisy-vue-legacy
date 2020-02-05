const { agent, expect } = require('./index');

const BASE_URL = '/api/core/config';

describe(BASE_URL, () => {
  const get = () => agent().get(BASE_URL);

  describe('GET', () => {
    it('Should return the public config', async () => {
      const { status, body } = await get().send();
      expect(status).to.equal(200);
      expect(body).to.be.an('object');
    });
  });
});
