const artistsEndpoints = (router, model) => {

  router.get('/artists/:id', (req, res) => {
    const artist = model.unqfy.getArtistById(req.model.id);
    res.json(artist.toJson());
  });

  router.get('/artists', (req, res) => {
    const artists = model.unqfy.findArtistsByName(req.query.name);

    res.json(artists.map(a=>a.toJson()));
  });

  router.get('/videos', (req, res) => {
    return model.unqfy.findVideosForArtist(req.query.name)
      .then(videos=>res.json(videos))
      .catch(e=>console.log("error: ", e));
  });

  router.post('/artists', (req, res) => {
    return model.unqfy.addArtist(req.body).then(artist=>res.json(artist.toJson()));
  });

  router.delete('/artists/:id', (req, res) => {
    model.unqfy.removeArtist(req.model.id);
    res.json({success: true});
  });

};

module.exports = {
  register: artistsEndpoints
};