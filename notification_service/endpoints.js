const errors = require('./errors');

function errorHandler(res, err) {
  const jsonError = errors.buildJsonErrorFrom(err);
  res.status(jsonError.status);
  res.json(jsonError);
  console.log('Handled error: ', err);
}

const notificationEndpoints = (router, model) => {

  router.post('/subscribe', (req, res) => {

    return model.notifications.subscribe(req.body)
      .then(()=>res.json({}))
      .catch(err => errorHandler(res, err));
  });

  router.post('/unsubscribe', (req, res) => {
    return model.notifications.unsubscribe(req.body)
      .then(()=>res.json({}))
      .catch(err => errorHandler(res, err));
  });

  router.post('/notify', (req, res) => {
    return model.notifications.notify(req.body.artistId, req.body.subject, req.body.message, req.body.from)
      .then(()=>res.json({}))
      .catch(err => errorHandler(res, err));
  });

  router.get('/subscriptions', (req, res) => {
    return model.notifications.getSubscriptions(req.query.artistId)
      .then(a=>res.json(a))
      .catch(err => errorHandler(res, err));
  });

  router.delete('/subscriptions', (req, res) => {
    return model.notifications.unsubscribeAll(req.body.artistId)
      .then(a=>res.json(a))
      .catch(err => errorHandler(res, err));
  });

};

module.exports = {
  register: notificationEndpoints
};