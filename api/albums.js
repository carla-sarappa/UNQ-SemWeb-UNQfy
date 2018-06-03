const albumsEndpoints = (router, unqfy) => {

  router.get('/albums', (req, res) => {
    const albums = req.query.name ?
      unqfy.getAlbumByName(req.query.name) : unqfy.getAlbums();

    res.json(albums);
  });
    
  router.post('/albums', (req, res) => {
    const album = unqfy.addAlbum(req.body);
    res.json({ success: true, album: album});
  });

  router.delete('/albums/:id', (req, res) => {
    unqfy.removeAlbum(req.model.id);
    res.json({ success: true});
  });

};

module.exports = {
  register: albumsEndpoints
};