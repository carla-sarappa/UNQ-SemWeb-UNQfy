const unqmod = require('../unqfy');

module.exports = {
  register: router => {
    router.get('/albums', (req, res) => {
      let albums = [];
      try {
        if (req.query.name){
          albums = unqmod.getUNQfy().getAlbumByName(req.query.name);
        } else {
          albums = unqmod.getUNQfy().getAlbums();
        }
        res.json(albums);
      } catch (error) {
        res.json({ error: error});
      }
     
    });
      
    router.post('/albums', (req, res) => {
      
      res.json({ message: 'hooray! welcome to our api!' });
    });
      
    router.delete('/albums', (req, res) => {
      res.json({ message: 'hooray! welcome to our api!' });
    });
  }
};