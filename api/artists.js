const artistsEndpoints = (router, model) => {

  router.get('/artists/:id', (req, res) => {
    const artist = model.unqfy.getArtistById(req.model.id);
    res.json(artist);
  });

  router.get('/artists', (req, res) => {
    const artists = req.query.name ?
      model.unqfy.getArtistByName(req.query.name) : model.unqfy.getArtists();

    res.json(artists);
  });

  router.post('/artists', (req, res) => {
    const artist = model.unqfy.addArtist(req.body);
    res.json({ success: true, artist: artist});
  });

  router.delete('/artists/:id', (req, res) => {
    model.unqfy.removeArtist(req.model.id);
    res.json({ success: true});
  });

};

module.exports = {
  register: artistsEndpoints
};