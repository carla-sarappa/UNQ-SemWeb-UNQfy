const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('../unqfy');

function getUNQfy(filename) {
  let unqfy = new unqmod.UNQfy();
  
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}


module.exports = {
  register: router => {
    router.get('/albums', (req, res) => {
      let albums = [];
      try {
        if (req.query.name){
          albums = getUNQfy("estado").getAlbumByName(req.query.name);
        } else {
          albums = getUNQfy("estado").getAlbums();
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