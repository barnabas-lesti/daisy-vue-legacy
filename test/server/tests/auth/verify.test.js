const { agent, expect, config, data } = require('../../index');

const BASE_URL = '/api/auth/verify';

describe(BASE_URL, () => {
  const post = () => agent().post(BASE_URL);

  beforeEach(async () => {
    await data.common.cleanDb();
  });

  describe('POST', () => {
    it('Should return 200, the auth header and the auth payload if the header is valid', async () => {
      const user = await data.auth.createAndSaveUser();
      const authHeader = await data.auth.createAuthHeader(user);

      const { status, body, headers } = await post().set(config.AUTH_HEADER, authHeader).send();

      expect(status).to.equal(200);
      expect(await data.auth.verifyAuthHeader(headers[config.AUTH_HEADER])).to.be.true;
      expect(body.email).to.equal(user.email);
      expect(body.id).to.not.be.undefined;
      expect(body.id).to.equal(user.id);
      expect(body.iat).to.be.undefined;
      expect(body.exp).to.be.undefined;
    });

    it('Should return 200 and the updated auth header if the accessToken expired/invalid, but the refreshToken is valid', async () => {
      const user = await data.auth.createAndSaveUser();
      const invalidAccessToken = await data.auth.createAccessToken(user, { expiresIn: '-10s' });
      const partiallyInvalidAuthHeader = await data.auth.createAuthHeader(user, { accessToken: invalidAccessToken });
      const { refreshToken } = data.auth.parseAuthHeader(partiallyInvalidAuthHeader);

      const { status, body, headers } = await post().set(config.AUTH_HEADER, partiallyInvalidAuthHeader).send();

      expect(status).to.equal(200);

      const newAuthHeader = headers[config.AUTH_HEADER];
      expect(await data.auth.verifyAuthHeader(newAuthHeader)).to.be.true;

      const { accessToken, refreshToken: refreshTokenFromNewHeader } = data.auth.parseAuthHeader(newAuthHeader);
      const accessTokenPayload = await data.auth.verifyAccessToken(accessToken);
      expect(refreshToken).to.equal(refreshTokenFromNewHeader);
      expect(accessTokenPayload.id).to.equal(user.id);
      expect(accessTokenPayload.email).to.equal(user.email);
      expect(body.id).to.equal(user.id);
      expect(body.email).to.equal(user.email);
    });

    it('Should return 401 and an error if auth header is invalid', async () => {
      const user = await data.auth.createUser();
      const invalidAuthHeader = await data.auth.createInvalidAuthHeader(user);

      const { status, body } = await post().set(config.AUTH_HEADER, invalidAuthHeader).send();

      expect(status).to.equal(401);
      expect(body.error).to.equal('UNAUTHORIZED');
    });
  });
});
