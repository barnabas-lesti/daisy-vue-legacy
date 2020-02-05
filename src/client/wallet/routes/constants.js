const { router } = require('../../core');
const constants = require('../config/constants');

const BASE_URL = '/wallet/constants';

router.route(BASE_URL)
  .get(async (req, res) => {
    return res.send(constants);
  });
