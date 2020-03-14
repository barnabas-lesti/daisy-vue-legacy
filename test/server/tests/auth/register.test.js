const { agent, expect, data } = require('../../index');

const BASE_URL = '/api/auth/register';

describe(BASE_URL, () => {
  const put = () => agent().put(BASE_URL);

  beforeEach(async () => {
    await data.common.cleanDb();
  });

  describe('PUT', () => {
    it('Should return 200, create a new user and return it', async () => {
      const user = await data.auth.createUser();

      const { status, body } = await put().send(user);

      expect(status).to.equal(200);
      expect(body.email).to.equal(user.email);
      expect(body.password).to.be.undefined;
      expect(body.passwordHash).to.be.undefined;

      const userInDb = await data.auth.findUser({ email: user.email });
      expect(!!userInDb).to.be.true;
      expect(await data.auth.comparePasswords(user.password, userInDb.passwordHash)).to.be.true;
      expect(`${userInDb._id}`).to.equal(body.id);
    });

    it('Should return 400 and an error if required fields are missing', async () => {
      const { email } = await data.auth.createUser();

      const { status, body } = await put().send({ email });

      expect(status).to.equal(400);
      expect(body.error).to.equal('FIELDS_MISSING');
    });

    it('Should return 400 and an error if user already exists', async () => {
      const user = await data.auth.createAndSaveUser();

      const { status, body } = await put().send(user);

      expect(status).to.equal(400);
      expect(body.error).to.equal('ALREADY_EXISTS');
    });
  });
});
