const { agent, expect, config, data } = require('../../../index');

const BASE_URL = '/api/auth/profile';

describe(BASE_URL, () => {
  const get = () => agent().get(BASE_URL);
  const patch = () => agent().patch(BASE_URL);
  const del = () => agent().del(BASE_URL);

  beforeEach(async () => {
    await data.common.cleanDb();
  });

  describe('GET', () => {
    it('Should return 200 and the signed in users profile', async () => {
      const user = await data.auth.createAndSaveUser();
      const authHeader = await data.auth.createAuthHeader(user);

      const { status, body } = await get().set(config.AUTH_HEADER, authHeader).send();

      expect(status).to.equal(200);
      expect(body.email).to.not.be.undefined;
      expect(body.password).to.be.undefined;
      expect(body.passwordHash).to.be.undefined;
    });

    it('Should return 401 and an error if auth state is invalid', async () => {
      const user = await data.auth.createUser();
      const invalidAuthHeader = await data.auth.createInvalidAuthHeader(user);

      const { status, body } = await get().set(config.AUTH_HEADER, invalidAuthHeader).send();

      expect(status).to.equal(401);
      expect(body.error).to.equal('UNAUTHORIZED');
    });

    it('Should return 404 and an error if user was not found', async () => {
      const user = await data.auth.createUser();
      const authHeader = await data.auth.createAuthHeader(user);

      const { status, body } = await get().set(config.AUTH_HEADER, authHeader).send();

      expect(status).to.equal(404);
      expect(body.error).to.equal('NOT_FOUND');
    });
  });

  describe('PATCH', () => {
    it('Should return 200 and the updated user profile', async () => {
      const user = await data.auth.createAndSaveUser();
      const update = await data.auth.createUser();
      const authHeader = await data.auth.createAuthHeader(user);

      const { status, body } = await patch().set(config.AUTH_HEADER, authHeader).send(update);

      expect(status).to.equal(200);
      expect(body.email).to.equal(user.email);
      expect(body.fullName).to.equal(update.fullName);
      expect(body.password).to.be.undefined;
      expect(body.passwordHash).to.be.undefined;

      const userInDb = await data.auth.findUser({ email: user.email });
      expect(await data.auth.comparePasswords(user.password, userInDb.passwordHash)).to.be.true;
      expect(await data.auth.comparePasswords(update.password, userInDb.passwordHash)).to.be.false;
    });

    it('Should return 401 and an error if auth state is invalid', async () => {
      const user = await data.auth.createUser();
      const invalidAuthHeader = await data.auth.createInvalidAuthHeader(user);

      const { status, body } = await patch().set(config.AUTH_HEADER, invalidAuthHeader).send();

      expect(status).to.equal(401);
      expect(body.error).to.equal('UNAUTHORIZED');
    });

    it('Should return 404 and an error if user was not found', async () => {
      const user = await data.auth.createUser();
      const authHeader = await data.auth.createAuthHeader(user);

      const { status, body } = await patch().set(config.AUTH_HEADER, authHeader).send();

      expect(status).to.equal(404);
      expect(body.error).to.equal('NOT_FOUND');
    });
  });

  describe('DELETE', () => {
    it('Should return 200 and delete the user', async () => {
      const user = await data.auth.createAndSaveUser();
      const authHeader = await data.auth.createAuthHeader(user);

      const { status } = await del().set(config.AUTH_HEADER, authHeader).send();

      expect(status).to.equal(200);
      const userInDb = await data.auth.findUser({ email: user.email });
      expect(!!userInDb).to.be.false;
    });

    it('Should return 401 and an error if auth state is invalid', async () => {
      const user = await data.auth.createUser();
      const invalidAuthHeader = await data.auth.createInvalidAuthHeader(user);

      const { status, body } = await del().set(config.AUTH_HEADER, invalidAuthHeader).send();

      expect(status).to.equal(401);
      expect(body.error).to.equal('UNAUTHORIZED');
    });

    it('Should return 404 and an error if user was not found', async () => {
      const user = await data.auth.createUser();
      const authHeader = await data.auth.createAuthHeader(user);

      const { status, body } = await del().set(config.AUTH_HEADER, authHeader).send();

      expect(status).to.equal(404);
      expect(body.error).to.equal('NOT_FOUND');
    });
  });
});
