const albumsEndpoints = (router, model) => {

  router.get('/albums/:id', (req, res) => {
    const album = model.unqfy.getAlbumById(req.model.id);
    res.json(album);
  });

  router.get('/albums', (req, res) => {
    const albums = req.query.name ?
      model.unqfy.getAlbumByName(req.query.name) : model.unqfy.getAlbums();

    res.json(albums);
  });
    
  router.post('/albums', (req, res) => {
    const album = model.unqfy.addAlbum(req.body);
    res.json({ success: true, album: album});
  });

  router.delete('/albums/:id', (req, res) => {
    model.unqfy.removeAlbum(req.model.id);
    res.json({ success: true});
  });

};

module.exports = {
  register: albumsEndpoints
};