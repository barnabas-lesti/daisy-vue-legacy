const router = require('express').Router();

const User = require('../../models/user');

router.route('/auth/sign-in')
  .post(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ error: 'FIELDS_MISSING' });

    const doc = await User.Doc.findOne({ email });
    if (!doc) return res.status(404).send({ error: 'NOT_FOUND' });

    const isPasswordValid = await User.comparePasswords(password, doc.passwordHash);
    if (!isPasswordValid) return res.status(401).send({ error: 'INVALID_CREDENTIALS' });

    const authHeader = await User.createAuthHeader(doc);
    const user = new User(doc, { passwords: false });

    return res.status(200).send({ user, authHeader });
  });

module.exports = router;
