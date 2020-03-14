const config = require('../../config');
const User = require('../../models/user');

module.exports = () => async (req, res, next) => {
  const originalHeaderString = req.header(config.AUTH_HEADER) || '';
  if (!originalHeaderString) return next();

  const verificationResult = await User.verifyAuthHeader(originalHeaderString);
  if (!verificationResult) return next();

  const { newHeaderString, payload } = verificationResult;
  res.set(config.AUTH_HEADER, newHeaderString || originalHeaderString);

  const { email, id } = payload;
  req.auth = { email, id, userId: id };
  return next();
};
