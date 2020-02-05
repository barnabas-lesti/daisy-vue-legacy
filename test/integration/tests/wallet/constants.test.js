const { agent, expect } = require('../core');

const BASE_URL = '/api/wallet/constants';

describe(BASE_URL, () => {
  const get = () => agent().get(BASE_URL);

  describe('GET', () => {
    it('Should return wallet configuration constants', async () => {
      const { status, body } = await get().send();
      expect(status).to.equal(200);
      expect(body.categories).to.be.an('array');
      expect(body.currencies).to.be.an('array');
      expect(body.itemTypes).to.be.an('array');
      expect(body.paymentTypes).to.be.an('array');
    });
  });
});
