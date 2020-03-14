const router = require('express').Router();

const User = require('../../../models/user');

router.route('/auth/profile')
  .get(async (req, res) => {
    if (!req.auth) return res.status(401).send({ error: 'UNAUTHORIZED' });

    const { email } = req.auth;
    const userDoc = await User.Doc.findOne({ email });
    if (!userDoc) return res.status(404).send({ error: 'NOT_FOUND' });

    const user = new User(userDoc, { passwords: false });
    return res.status(200).send(user);
  })
  .patch(async (req, res) => {
    if (!req.auth) return res.status(401).send({ error: 'UNAUTHORIZED' });

    const { email } = req.auth;
    const { email: e, passwordHash: ph, ...update } = req.body;
    const updatedDoc = await User.Doc.findOneAndUpdate({ email }, update, { new: true });
    if (!updatedDoc) return res.status(404).send({ error: 'NOT_FOUND' });

    const user = new User(updatedDoc, { passwords: false });
    return res.status(200).send(user);
  })
  .delete(async (req, res) => {
    if (!req.auth) return res.status(401).send({ error: 'UNAUTHORIZED' });

    const { email } = req.auth;
    const existingUser = await User.Doc.findOne({ email });
    if (!existingUser) return res.status(404).send({ error: 'NOT_FOUND' });

    await User.Doc.deleteOne({ email });
    return res.status(200).send();
  });

module.exports = router;
