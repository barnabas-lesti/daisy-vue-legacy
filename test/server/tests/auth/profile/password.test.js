const { agent, expect, config, data } = require('../../../index');

const BASE_URL = '/api/auth/profile/password';

describe(BASE_URL, () => {
  const patch = (authHeader = '') => agent().patch(BASE_URL).set(config.AUTH_HEADER, authHeader);

  beforeEach(async () => {
    await data.common.cleanDb();
  });

  describe('PATCH', () => {
    it('Should return 200, update the auth. header and the users password', async () => {
      const user = await data.auth.createAndSaveUser();
      const { password } = user;
      const { password: newPassword } = await data.auth.createUser();
      const authHeader = await data.auth.createAuthHeader(user);

      const { status, body, headers } = await patch().set(config.AUTH_HEADER, authHeader).send({ password, newPassword });

      expect(status).to.equal(200);
      expect(body.email).to.equal(user.email);
      expect(body.password).to.be.undefined;
      expect(body.passwordHash).to.be.undefined;

      const newAuthHeader = headers[config.AUTH_HEADER];
      expect(await data.auth.verifyAuthHeader(newAuthHeader)).to.be.true;
      expect(newAuthHeader).to.not.equal(authHeader);

      const userInDb = await data.auth.findUser({ email: user.email });
      expect(!!userInDb).to.be.true;
      expect(await data.auth.comparePasswords(password, userInDb.passwordHash)).to.be.false;
      expect(await data.auth.comparePasswords(newPassword, userInDb.passwordHash)).to.be.true;
    });

    it('Should return 400 and an error if required fields are missing', async () => {
      const user = await data.auth.createAndSaveUser();
      const { password } = user;
      const { password: newPassword } = await data.auth.createUser();
      const authHeader = await data.auth.createAuthHeader(user);

      const [ noPasswordRes, noNewPasswordRes ] = await Promise.all([
        patch(authHeader).send({ newPassword }),
        patch(authHeader).send({ password }),
      ]);

      expect(noPasswordRes.status).to.equal(400);
      expect(noPasswordRes.body.error).to.equal('FIELDS_MISSING');
      expect(noNewPasswordRes.status).to.equal(400);
      expect(noNewPasswordRes.body.error).to.equal('FIELDS_MISSING');
    });

    it('Should return 401 and an error if credentials are invalid', async () => {
      const user = await data.auth.createAndSaveUser();
      const { email, password: newPassword } = user;
      const { password: invalidPassword } = await data.auth.createUser();
      const authHeader = await data.auth.createAuthHeader(user);

      const { status, body } = await patch(authHeader).send({ email, password: invalidPassword, newPassword });

      expect(status).to.equal(401);
      expect(body.error).to.equal('INVALID_CREDENTIALS');
    });

    it('Should return 401 and an error if auth state is invalid', async () => {
      const user = await data.auth.createUser();
      const invalidAuthHeader = await data.auth.createInvalidAuthHeader(user);

      const { status, body } = await patch(invalidAuthHeader).send();

      expect(status).to.equal(401);
      expect(body.error).to.equal('UNAUTHORIZED');
    });

    it('Should return 404 and an error if user was not found', async () => {
      const user = await data.auth.createUser();
      const { email, password } = user;
      const { password: newPassword } = await data.auth.createUser();
      const authHeader = await data.auth.createAuthHeader(user);

      const { status, body } = await patch(authHeader).send({ email, password, newPassword });

      expect(status).to.equal(404);
      expect(body.error).to.equal('NOT_FOUND');
    });
  });
});
