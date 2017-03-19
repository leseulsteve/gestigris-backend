'use strict';

var _ = require('lodash');

module.exports = function(express, entityManager) {

  var router = express.Router();

  router.route('/')

  .post(function(req, res) {
    if (!_.isFunction(entityManager.create)) {
      return res.sendStatus(404);
    }
    entityManager.create(req.body, req.user).then(function(item) {
      res.status(200).send(item);
    }).catch(function(error) {
      console.error(error);
      res.status(error.code).send(error.reason);
    });
  })

  .get(function(req, res) {
    if (!_.isFunction(entityManager.find)) {
      return res.sendStatus(404);
    }
    entityManager.find(req.query, req.user).then(function(items) {
      res.status(200).send(items);
    }).catch(function(error) {
      console.error(error);
      res.status(error.code).send(error.reason);
    });
  });

  router.route('/:itemId')

  .get(function(req, res) {
    if (!_.isFunction(entityManager.findById)) {
      return res.sendStatus(404);
    }
    entityManager.findById(req.params.itemId, req.user).then(function(item) {
      res.status(200).send(item);
    }).catch(function(error) {
      console.error(error);
      res.status(error.code).send(error.reason);
    });
  })

  .put(function(req, res) {
    if (!_.isFunction(entityManager.update)) {
      return res.sendStatus(404);
    }
    entityManager.update(req.params.itemId, req.body, req.user).then(function(item) {
      res.status(200).send(item);
    }).catch(function(error) {
      console.error(error);
      res.status(error.code).send(error.reason);
    });
  })

  .delete(function(req, res) {
    if (!_.isFunction(entityManager.remove)) {
      return res.sendStatus(404);
    }
    entityManager.remove(req.params.itemId, req.user).then(function() {
      res.sendStatus(200);
    }).catch(function(error) {
      console.error(error);
      res.status(error.code).send(error.reason);
    });
  });

  return router;
};
