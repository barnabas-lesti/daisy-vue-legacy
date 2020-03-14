const router = require('express').Router();

const config = require('../../config');
const User = require('../../models/user');

router.route('/auth/register')
  .put(async (req, res) => {
    if (config.env.REGISTRATION_DISABLED) return res.status(501).send({ error: 'REGISTRATION_DISABLED' });

    const user = new User(req.body);
    const { email, password } = user;
    if (!email || !password) return res.status(400).send({ error: 'FIELDS_MISSING' });

    const existingUser = await User.Doc.findOne({ email });
    if (existingUser) return res.status(400).send({ error: 'ALREADY_EXISTS' });

    user.passwordHash = await User.hashPassword(password);
    const doc = await User.Doc.create(user);
    return res.status(200).send(new User({ ...doc.toObject(), passwordHash: undefined }));
  });

module.exports = router;
