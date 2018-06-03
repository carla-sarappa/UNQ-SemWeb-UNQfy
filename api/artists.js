const artistsEndpoints = (router, unqfy) => {

  router.get('/artists/:id', (req, res) => {
    const artist = unqfy.getArtistById(req.model.id);
    res.json(artist);
  });

  router.get('/artists', (req, res) => {
    const artists = req.query.name ?
      unqfy.getArtistByName(req.query.name) : unqfy.getArtists();

    res.json(artists);
  });

  router.post('/artists', (req, res) => {
    const artist = unqfy.addArtist(req.body);
    res.json({ success: true, artist: artist});
  });

  router.delete('/artists/:id', (req, res) => {
    unqfy.removeArtist(req.model.id);
    res.json({ success: true});
  });

};

module.exports = {
  register: artistsEndpoints
};