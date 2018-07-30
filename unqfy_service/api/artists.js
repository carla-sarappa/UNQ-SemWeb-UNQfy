const artistsEndpoints = (router, model) => {

  router.get('/artists/:id', (req, res) => {
    const artist = model.unqfy.getArtistById(req.model.id);
    res.json(artist.toJson());
  });

  router.get('/artists', (req, res) => {
    const artists = model.unqfy.findArtistsByName(req.query.name);

    res.json(artists.map(a=>a.toJson()));
  });

  router.post('/artists', (req, res) => {
    const artist = model.unqfy.addArtist(req.body);
    res.json(artist.toJson());
  });

  router.delete('/artists/:id', (req, res) => {
    model.unqfy.removeArtist(req.model.id);
    res.json({success: true});
  });

};

module.exports = {
  register: artistsEndpoints
};