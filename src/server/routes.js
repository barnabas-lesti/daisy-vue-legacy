const express = require('express');

const router = express.Router();

router.get('*', (req, res) => {
  // TODO: Implement html return.
  res.sendStatus(200);
});

module.exports = router;
