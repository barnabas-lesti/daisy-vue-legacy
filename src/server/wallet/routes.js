const { router, logger, DbTypes } = require('../core');
const WalletItem = require('./models/wallet-item');

router.route('/wallet')
  .put(async (req, res) => {
    try {
      const { _id, ...result } = (await WalletItem.create(req.body)).toObject();
      return res.send(result);
    } catch (error) {
      logger.error(error);
      return res.status(500).send(error.toString());
    }
  })
  .get(async (req, res) => {
    // TODO: Implement query handling
    const results = (await WalletItem.find({})).map(doc => {
      const { _id, ...result } = doc.toObject();
      return result;
    });
    return res.send(results);
  });

router.route('/wallet/:id')
  .get(async (req, res) => {
    const { id } = req.params;
    if (DbTypes.ObjectId.isValid(id)) {
      const doc = await WalletItem.findById(id);
      if (doc) {
        const { _id, ...result } = doc.toObject();
        return res.send(result);
      }
    }
    return res.sendStatus(404);
  })
  .patch(async (req, res) => {
    const { id } = req.params;
    const { _id, ...update } = req.body;
    if (DbTypes.ObjectId.isValid(id)) {
      const doc = await WalletItem.findOneAndUpdate({ _id: id }, update, { new: true });
      if (doc) {
        const { _id, ...result } = doc.toObject();
        return res.send(result);
      }
    }
    return res.sendStatus(404);
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    if (DbTypes.ObjectId.isValid(id)) {
      const doc = await WalletItem.findByIdAndRemove(id);
      if (doc) return res.sendStatus(200);
    }
    return res.sendStatus(404);
  });
