const router = require('express').Router();

const config = require('../../../config');
const User = require('../../../models/user');

router.route('/auth/profile/password')
  .patch(async (req, res) => {
    if (!req.auth) return res.status(401).send({ error: 'UNAUTHORIZED' });

    const { password, newPassword } = req.body;
    if (!password || !newPassword) return res.status(400).send({ error: 'FIELDS_MISSING' });

    const { email } = req.auth;
    const doc = await User.Doc.findOne({ email });
    if (!doc) return res.status(404).send({ error: 'NOT_FOUND' });

    const credentialsValid = await User.comparePasswords(password, doc.passwordHash);
    if (!credentialsValid) return res.status(401).send({ error: 'INVALID_CREDENTIALS' });

    const passwordHash = await User.hashPassword(newPassword);
    const updatedDoc = await User.Doc.findOneAndUpdate({ email }, { passwordHash }, { new: true });

    const newAuthHeader = await User.createAuthHeader(updatedDoc);

    const user = new User(updatedDoc, { passwords: false });
    return res.status(200).set(config.AUTH_HEADER, newAuthHeader).send(user);
  });

module.exports = router;
