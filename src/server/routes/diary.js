const router = require('express').Router();

const DiaryItem = require('../models/diary-item');

router.route('/diary')
  .put(async (req, res) => {
    const { userId } = req.auth;
    const saveable = DiaryItem.convertToSaveable(new DiaryItem({ ...req.body, userId }));
    const existingDoc = await DiaryItem.Doc.findOne({ userId, dateString: saveable.dateString });
    if (existingDoc) return res.status(400).send({ error: 'ALREADY_EXISTS' });

    const { _id } = await DiaryItem.Doc.create(saveable);
    const doc = await DiaryItem.Doc.findById(_id);
    const populatedDoc = await DiaryItem.Doc.deepPopulate(doc);
    const item = DiaryItem.convertFromDoc(populatedDoc);
    return res.status(200).send(item);
  })
  .get(async (req, res) => {
    const { userId } = req.auth;
    const query = {
      yearMonth: req.query['by-year-month'],
      dayOfWeek: req.query['by-day-of-week'],
      dateStrings: req.query['by-date-strings'],
    };

    let docs;
    if (query.yearMonth) {
      docs = await DiaryItem.Doc.find({ dateString: { '$regex': query.yearMonth }, userId });
    } else {
      docs = await DiaryItem.Doc.find({ userId });
      if (query.dayOfWeek) {
        docs = docs
          .filter(doc => DiaryItem.getDatesOfWeekByDate(query.dayOfWeek).indexOf(doc.dateString) !== -1);
      } else if (query.dateStrings) {
        docs = docs
          .filter(doc => query.dateStrings.indexOf(doc.dateString) !== -1);
      }
    }

    const populatedDocs = await DiaryItem.Doc.deepPopulate(docs);
    const items = populatedDocs.map(doc => DiaryItem.convertFromDoc(doc));
    return res.status(200).send(items);
  });

router.route('/diary/:dateString')
  .get(dietExistsGuard(DiaryItem.Doc), async (req, res) => {
    const doc = await DiaryItem.Doc.findById(req.diaryItem.id);
    const populatedDoc = await DiaryItem.Doc.deepPopulate(doc);
    const item = DiaryItem.convertFromDoc(populatedDoc);
    return res.status(200).send(item);
  })
  .patch(dietExistsGuard(DiaryItem.Doc), async (req, res) => {
    const { userId, date, dateString, id } = req.diaryItem;
    const update = DiaryItem.convertToSaveable({ ...req.body, userId, date, dateString });
    await DiaryItem.Doc.findOneAndUpdate({ _id: id }, update, { new: true });
    const updatedDoc = await DiaryItem.Doc.findOne({ _id: id });
    const populatedDoc = await DiaryItem.Doc.deepPopulate(updatedDoc);
    const updatedItem = DiaryItem.convertFromDoc(populatedDoc);
    return res.status(200).send(updatedItem);
  })
  .delete(dietExistsGuard(), async (req, res) => {
    const { id: _id } = req.diaryItem;
    await DiaryItem.Doc.deleteOne({ _id });
    return res.status(200).send();
  });

function dietExistsGuard () {
  return async (req, res, next) => {
    const { userId } = req.auth;
    const { dateString } = req.params;
    const doc = await DiaryItem.Doc.findOne({ dateString, userId });
    if (!doc) return res.status(404).send({ error: 'NOT_FOUND' });

    req.diaryItem = DiaryItem.convertFromDoc(doc);
    return next();
  };
}

module.exports = router;
