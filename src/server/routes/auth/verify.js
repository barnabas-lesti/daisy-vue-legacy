const router = require('express').Router();

router.route('/auth/verify')
  .post(async (req, res) => {
    if (!req.auth) return res.status(401).send({ error: 'UNAUTHORIZED' });

    return res.status(200).send(req.auth);
  });

module.exports = router;
