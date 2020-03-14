const { Types } = require('mongoose');
const router = require('express').Router();

const Food = require('../../models/food');

router.route('/diet/foods')
  .put(async (req, res) => {
    const { userId } = req.auth;
    const doc = await Food.Doc.create({ ...req.body, userId });
    return res.status(200).send(new Food(doc.toObject()));
  })
  .get(async (req, res) => {
    const { userId } = req.auth;
    const docs = await Food.Doc.find({ userId });
    const foods = docs.map(doc => new Food(doc.toObject()));
    return res.status(200).send(foods);
  });

router.route('/diet/foods/:id')
  .get(foodExists(), async (req, res) => {
    return res.status(200).send(new Food(req.item));
  })
  .patch(foodExists(), async (req, res) => {
    const { id: _id } = req.params;
    const { userId, ...update } = req.body;
    const updatedFood = await Food.Doc.findOneAndUpdate({ _id }, update, { new: true });
    return res.status(200).send(new Food(updatedFood.toObject()));
  })
  .delete(foodExists(), async (req, res) => {
    const { id: _id } = req.params;
    await Food.Doc.deleteOne({ _id });
    return res.status(200).send();
  });

function foodExists () {
  return async (req, res, next) => {
    const { userId } = req.auth || {};
    const { id: _id } = req.params;
    if (!Types.ObjectId.isValid(_id)) return res.status(404).send({ error: 'NOT_FOUND' });

    const doc = await Food.Doc.findOne({ _id, userId });
    if (!doc) return res.status(404).send({ error: 'NOT_FOUND' });

    req.item = doc.toObject();
    return next();
  };
}

module.exports = router;
