const config = require('../config');
const router = require('../router');

const BASE_URL = '/core/config';

router.route(BASE_URL)
  .get(async (req, res) => {
    return res.send(config.get('public'));
  });
