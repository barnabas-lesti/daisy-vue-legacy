const { Types } = require('mongoose');
const router = require('express').Router();

const Recipe = require('../../models/recipe');

router.route('/diet/recipes')
  .put(async (req, res) => {
    const { userId } = req.auth;

    const saveable = Recipe.convertToSaveable({ ...req.body, userId });
    const { _id } = await Recipe.Doc.create(saveable);
    const doc = await Recipe.Doc.findById(_id).populate('ingredients.food');
    return res.status(200).send(Recipe.convertFromDoc(doc));
  })
  .get(async (req, res) => {
    const { userId } = req.auth;
    const docs = await Recipe.Doc.find({ userId }).populate('ingredients.food');
    const recipes = docs.map(doc => Recipe.convertFromDoc(doc));
    return res.status(200).send(recipes);
  });

router.route('/diet/recipes/:id')
  .get(recipeExists(), async (req, res) => {
    const doc = await Recipe.Doc.findById(req.params.id).populate('ingredients.food');
    return res.status(200).send(Recipe.convertFromDoc(doc));
  })
  .patch(recipeExists(), async (req, res) => {
    const { userId } = req.auth;
    const { id: _id } = req.params;

    const saveable = Recipe.convertToSaveable({ ...req.body, userId });
    await Recipe.Doc.findOneAndUpdate({ _id }, saveable, { new: true });
    const updatedDoc = await Recipe.Doc.findById(_id).populate('ingredients.food');
    return res.status(200).send(Recipe.convertFromDoc(updatedDoc));
  })
  .delete(recipeExists(), async (req, res) => {
    const { id: _id } = req.params;
    await Recipe.Doc.deleteOne({ _id });
    return res.status(200).send();
  });

function recipeExists () {
  return async (req, res, next) => {
    const { userId } = req.auth || {};
    const { id: _id } = req.params;
    if (!Types.ObjectId.isValid(_id)) return res.status(404).send({ error: 'NOT_FOUND' });

    const doc = await Recipe.Doc.findOne({ _id, userId });
    if (!doc) return res.status(404).send({ error: 'NOT_FOUND' });

    req.item = doc.toObject();
    return next();
  };
}

module.exports = router;
