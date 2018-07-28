

const notificationEndpoints = (router, model) => {

  router.post('/subscribe', (req, res) => {
    return model.notifications.subscribe(req.body.artistName, req.body.email)
      .then(()=>res.json({}));
  });

  router.post('/unsubscribe', (req, res) => {
    model.notifications.unsubscribe(req.body.artistName, req.body.email);
    res.json({});
  });

  // router.post('/notify', (req, res) => {
  //   const album = model.unqfy.addAlbumToArtist(req.body);
  //   res.json(album.toJson());
  // });

  router.get('/subscriptions', (req, res) => {
    return model.notifications.getSubscriptions(req.query.artistName)
      .then(a=>res.json(a));
  });

  router.delete('/subscriptions', (req, res) => {
    return model.notifications.unsubscribeAll(req.body.artistName);
  });

};

module.exports = {
  register: notificationEndpoints
};