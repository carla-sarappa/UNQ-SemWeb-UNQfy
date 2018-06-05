const albumsEndpoints = (router, model) => {

  router.get('/albums/:id', (req, res) => {
    const album = model.unqfy.getAlbumById(req.model.id);
    res.json(album.toJson());
  });

  router.get('/albums', (req, res) => {
    const albums = model.unqfy
      .findAlbumsByName(req.query.name)
      .map(a => a.toJson());

    res.json(albums);
  });
    
  router.post('/albums', (req, res) => {
    const album = model.unqfy.addAlbumToArtist(req.body);
    res.json(album.toJson());
  });

  router.delete('/albums/:id', (req, res) => {
    model.unqfy.removeAlbum(req.model.id);
    res.json({success: true});
  });

};

module.exports = {
  register: albumsEndpoints
};