const { agent, expect, data } = require('../../index');

const BASE_URL = '/api/auth/sign-in';

describe(BASE_URL, () => {
  const post = () => agent().post(BASE_URL);

  beforeEach(async () => {
    await data.common.cleanDb();
  });

  describe('POST', () => {
    it('Should return 200, the auth header and the user if credentials are valid', async () => {
      const { id, email, password } = await data.auth.createAndSaveUser();
      const { status, body } = await post().send({ email, password });

      const { user, authHeader } = body;
      expect(status).to.equal(200);
      expect(user.email).to.equal(email);
      expect(user.id).to.equal(id);
      expect(user.password).to.be.undefined;
      expect(user.passwordHash).to.be.undefined;
      expect(await data.auth.verifyAuthHeader(authHeader)).to.be.true;
    });

    it('Should return 400 and an error if required fields are missing', async () => {
      const { email, password } = await data.auth.createUser();

      const [ noEmailResponse, noPasswordResponse ] = await Promise.all([
        post().send({ password }),
        post().send({ email }),
      ]);

      expect(noEmailResponse.status).to.equal(400);
      expect(noEmailResponse.body.error).to.equal('FIELDS_MISSING');
      expect(noPasswordResponse.status).to.equal(400);
      expect(noPasswordResponse.body.error).to.equal('FIELDS_MISSING');
    });

    it('Should return 401 and error if credentials are invalid', async () => {
      const existingUser = await data.auth.createAndSaveUser();
      const nonExistingUser = await data.auth.createUser();

      const { status, body } = await post().send({
        email: existingUser.email,
        password: nonExistingUser.password,
      });

      expect(status).to.equal(401);
      expect(body.error).to.equal('INVALID_CREDENTIALS');
    });

    it('Should return 404 and an error if user was not found', async () => {
      const { email, password } = await data.auth.createUser();

      const { status, body } = await post().send({ email, password });

      expect(status).to.equal(404);
      expect(body.error).to.equal('NOT_FOUND');
    });
  });
});
