const { Types } = require('mongoose');

const Exercise = require('../models/exercise');

module.exports = (router) => {
  router.route('/exercises')
    .get(async (req, res) => {
      const { search } = req.query;
      const query = {};
      if (search) {
        query['content.name'] = new RegExp(
          search
            .split(',')
            .map(fragment => fragment.trim())
            .join('|'),
          'i'
        );
      }
      const docs = await Exercise.find(query);
      return res.send(docs);
    })
    .put(async (req, res) => {
      const doc = await Exercise.create(req.body);
      return res.send(doc);
    });

  router.route('/exercises/:_id')
    .get(async (req, res) => {
      const { _id } = req.params;
      if (Types.ObjectId.isValid(_id)) {
        const doc = await Exercise.findById(_id);
        if (doc) { return res.send(doc); }
      }
      return res.status(404).end();
    })
    .patch(async (req, res) => {
      const { _id } = req.params;
      if (Types.ObjectId.isValid(_id)) {
        const updatedDoc = await Exercise.findOneAndUpdate({ _id }, req.body, { new: true });
        if (updatedDoc) { return res.send(updatedDoc); }
      }
      return res.status(404).end();
    })
    .delete(async (req, res) => {
      const { _id } = req.params;
      if (Types.ObjectId.isValid(_id)) {
        const doc = await Exercise.findByIdAndRemove(_id);
        if (doc) { return res.send(doc); }
      }
      return res.status(404).end();
    });

  return router;
};
