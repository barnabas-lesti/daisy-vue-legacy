const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../config');

const Doc = mongoose.model('User', new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
  },
  profileImageUrl: {
    type: String,
  },
}, {
  id: true,
  toJSON: {
    versionKey: false,
  },
  toObject: {
    versionKey: false,
  },
}));

class User {
  static Doc = Doc;
  static hashPassword = hashPassword;
  static comparePasswords = comparePasswords;
  static createAuthHeader = createAuthHeader;
  static verifyAuthHeader = verifyAuthHeader;

  /**
   * @param {User} args
   */
  constructor (
    { id, _id, email, fullName, password, passwordHash, profileImageUrl } = {},
    { passwords = true } = {}
  ) {
    this.id = `${id || _id || ''}`;
    this.email = email;
    this.fullName = fullName;
    this.profileImageUrl = profileImageUrl;

    if (passwords) {
      this.password = password;
      this.passwordHash = passwordHash;
    }
  }
}

/**
 * @param {String} password
 */
async function hashPassword (password) {
  const passwordHash = await bcrypt.hash(`${password}`, config.env.AUTH_SALT_ROUNDS);
  return passwordHash;
}

/**
 * @param {String} password
 * @param {String} passwordHash
 */
async function comparePasswords (password, passwordHash) {
  const result = await bcrypt.compare(`${password}`, `${passwordHash}`);
  return result;
}

/**
 * @param {User} user
 * @param {Object=} tokens
 * @param {Object=} options
 */
async function createAuthHeader (user, { accessToken, refreshToken } = {}, options = {}) {
  const finalAccessToken = accessToken || await _createAccessToken(user, options.accessToken);
  const finalRefreshToken = refreshToken || await _createRefreshToken(user, options.refreshToken);
  return `Access: ${finalAccessToken}; Refresh: ${finalRefreshToken};`;
}

/**
 * @param {String} authHeader
 */
async function verifyAuthHeader (authHeader) {
  const tokens = _parseAuthHeader(authHeader);
  if (!tokens) return null;
  const { accessToken, refreshToken } = tokens;

  const accessTokenPayload = await _verifyAccessToken(accessToken);
  if (accessTokenPayload) return { payload: accessTokenPayload };

  const refreshTokenPayload = await _verifyRefreshToken(refreshToken);
  if (!refreshTokenPayload) return null;

  return {
    newHeaderString: await createAuthHeader(refreshTokenPayload, { refreshToken }),
    payload: refreshTokenPayload,
  };
}

/**
 * @param {User} user
 * @param {Object?} options
 */
async function _createAccessToken ({ email, id }, { expiresIn = config.env.AUTH_ACCESS_TOKEN_EXPIRATION } = {}) {
  const payload = { email, id };
  const accessToken = await jwt.sign(payload, config.env.AUTH_SECRET, { expiresIn });
  return accessToken;
}

/**
 * @param {User} user
 * @param {Object?} options
 */
async function _createRefreshToken (user, { expiresIn = config.env.AUTH_REFRESH_TOKEN_EXPIRATION } = {}) {
  const { email, id, passwordHash } = user;
  if (!passwordHash) throw new Error('passwordHash field is missing');

  const payload = { email, id };
  const refreshTokenSecret = config.env.AUTH_SECRET + passwordHash;
  const refreshToken = await jwt.sign(payload, refreshTokenSecret, { expiresIn });
  return refreshToken;
}

/**
 * @param {String} accessToken
 */
async function _verifyAccessToken (accessToken) {
  try {
    const { email, id } = await jwt.verify(accessToken, config.env.AUTH_SECRET);
    return { email, id };
  } catch (jwtError) {
    return null;
  }
}

/**
 * @param {String} refreshToken
 */
async function _verifyRefreshToken (refreshToken) {
  const decoded = jwt.decode(refreshToken);
  if (!decoded) return null;

  const userDoc = await Doc.findOne({ email: decoded.email });
  if (!userDoc) return null;

  const { passwordHash } = new User(userDoc);
  try {
    const refreshTokenSecret = config.env.AUTH_SECRET + passwordHash;
    const payload = await jwt.verify(refreshToken, refreshTokenSecret);
    return payload;
  } catch (jwtError) {
    return null;
  }
}

function _parseAuthHeader (authHeader) {
  if (!authHeader) return null;

  const [ accessFragment = '', refreshFragment = '' ] = authHeader.split(';');
  const accessToken = accessFragment.replace(/access:\s/i, '').trim();
  const refreshToken = refreshFragment.replace(/refresh:\s/i, '').trim();

  if (!accessToken || !refreshToken) return null;

  return {
    accessToken,
    refreshToken,
  };
}

module.exports = User;
