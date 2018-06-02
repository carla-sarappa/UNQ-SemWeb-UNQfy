const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('../unqfy');

function getUNQfy() {
  const filename = 'estado';
  let unqfy = new unqmod.UNQfy();
  
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}



module.exports = {
  register: router => {
    router.get('/artists/:id', (req, res) => {
      
      res.json({ message: req.model.id });
    });

    router.post('/artists', (req, res) => {
      const artist = getUNQfy().addArtist(req.body);
      res.json(artist);
    });

    router.delete('/artists', (req, res) => {
      res.json({ message: 'hooray! welcome to our api!' });
    });
  }
};