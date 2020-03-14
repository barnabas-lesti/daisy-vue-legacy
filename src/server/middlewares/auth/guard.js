module.exports = () => (req, res, next) => {
  if (!req.auth) return res.status(401).send({ error: 'UNAUTHORIZED' });
  return next();
};
