const faker = require('faker');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../../../src/server/config');
const User = require('../../../src/server/models/user');

const createUser = async () => {
  const password = faker.internet.password(12);
  return new User({
    email: faker.internet.email(),
    fullName: faker.name.findName(),
    password,
    passwordHash: await _hashPassword(password),
  });
};

/**
 * @param {User} user
 */
const createAndSaveUser = async (userArg = null) => {
  const user = userArg || await createUser();
  const doc = await (new User.Doc(user)).save();
  return new User({ ...doc.toObject(), ...user });
};

const findUser = async (query) => {
  const user = await User.Doc.findOne(query);
  return user;
};

const comparePasswords = async (password, passwordHash) => {
  const result = await bcrypt.compare(`${password}`, `${passwordHash}`);
  return result;
};

const createAccessToken = async ({ email, id }, { expiresIn = config.env.AUTH_ACCESS_TOKEN_EXPIRATION } = {}) => {
  const payload = { email, id };
  const accessToken = await jwt.sign(payload, config.env.AUTH_SECRET, { expiresIn });
  return accessToken;
};

const createAuthHeader = async (user, { accessToken, refreshToken } = {}, options = {}) => {
  const finalAccessToken = accessToken || await createAccessToken(user, options.accessToken);
  const finalRefreshToken = refreshToken || await _createRefreshToken(user, options.refreshToken);
  return `Access: ${finalAccessToken}; Refresh: ${finalRefreshToken};`;
};

const createInvalidAuthHeader = async (user) => {
  const options = { accessToken: { expiresIn: '-10s' }, refreshToken: { expiresIn: '-10s' } };
  const invalidAuthHeader = await createAuthHeader(user, {}, options);
  return invalidAuthHeader;
};

const verifyAccessToken = async (accessToken) => {
  try {
    const payload = await jwt.verify(accessToken, config.env.AUTH_SECRET);
    return payload;
  } catch (jwtError) {
    return null;
  }
};

const verifyAuthHeader = async (authHeader) => {
  const tokens = parseAuthHeader(authHeader);
  if (!tokens) return false;

  const { accessToken, refreshToken } = tokens;
  const accessTokenPayload = await verifyAccessToken(accessToken);
  if (accessTokenPayload) return true;

  const refreshTokenPayload = await _verifyRefreshToken(refreshToken);
  if (!refreshTokenPayload) return false;

  return true;
};

const parseAuthHeader = (authHeader) => {
  if (!authHeader) return null;

  const [ accessFragment = '', refreshFragment = '' ] = authHeader.split(';');
  const accessToken = accessFragment.replace(/access:\s/i, '').trim();
  const refreshToken = refreshFragment.replace(/refresh:\s/i, '').trim();

  if (!accessToken || !refreshToken) return null;

  return {
    accessToken,
    refreshToken,
  };
};

const createAndSignInUser = async (userArg) => {
  const user = await createAndSaveUser(userArg || await createUser());
  const authHeader = await createAuthHeader(user);
  return { authHeader, user };
};

const _hashPassword = async (password) => {
  const passwordHash = await bcrypt.hash(`${password}`, config.env.AUTH_SALT_ROUNDS);
  return passwordHash;
};

const _createRefreshToken = async (user, { expiresIn = config.env.AUTH_REFRESH_TOKEN_EXPIRATION } = {}) => {
  const { email, id, passwordHash } = user;
  if (!passwordHash) throw new Error('passwordHash field is missing');

  const payload = { email, id };
  const refreshTokenSecret = config.env.AUTH_SECRET + passwordHash;
  const refreshToken = await jwt.sign(payload, refreshTokenSecret, { expiresIn });
  return refreshToken;
};

const _verifyRefreshToken = async (refreshToken) => {
  const decoded = jwt.decode(refreshToken);
  if (!decoded) return null;

  const userDoc = await User.Doc.findOne({ email: decoded.email });
  if (!userDoc) return null;

  const { passwordHash } = new User(userDoc);
  try {
    const refreshTokenSecret = config.env.AUTH_SECRET + passwordHash;
    const payload = await jwt.verify(refreshToken, refreshTokenSecret);
    return payload;
  } catch (jwtError) {
    return null;
  }
};

module.exports = {
  createUser,
  createAndSaveUser,
  createAndSignInUser,
  comparePasswords,
  createAccessToken,
  createAuthHeader,
  createInvalidAuthHeader,
  parseAuthHeader,
  verifyAuthHeader,
  verifyAccessToken,
  findUser,
};
