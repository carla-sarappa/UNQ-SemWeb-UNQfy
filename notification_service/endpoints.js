

const notificationEndpoints = (router, model) => {

  router.post('/subscribe', (req, res) => {
    return model.notifications.subscribe(req.body.artistId, req.body.email)
      .then(()=>res.json({}));
  });

  router.post('/unsubscribe', (req, res) => {
    return model.notifications.unsubscribe(req.body.artistId, req.body.email)
      .then(()=>res.json({}));
  });

  router.post('/notify', (req, res) => {
    return model.notifications.notify(req.body.artistId, req.body.subject, req.body.message, req.body.from)
      .then(()=>res.json({}));
  });

  router.get('/subscriptions', (req, res) => {
    return model.notifications.getSubscriptions(req.query.artistId)
      .then(a=>res.json(a));
  });

  router.delete('/subscriptions', (req, res) => {
    model.notifications.unsubscribeAll(req.body.artistId);
    res.json({});
  });

};

module.exports = {
  register: notificationEndpoints
};