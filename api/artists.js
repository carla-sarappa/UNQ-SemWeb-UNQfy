
const unqmod = require('../unqfy');

module.exports = {
  register: router => {
    router.get('/artists/:id', (req, res) => {
      const artist = unqmod.getUNQfy().getArtistById(req.model.id);
      res.json(artist);
    });

    router.get('/artists', (req, res) => {
      let artists = [];
      if (req.query.name){
        artists = unqmod.getUNQfy().getArtistByName(req.query.name);
      } else {
        artists = unqmod.getUNQfy().getArtists();
      }
      res.json(artists);
    });

    router.post('/artists', (req, res) => {
      const artist = unqmod.getUNQfy().addArtist(req.body);
      res.json({ success: true, artist: artist});
    });

    router.delete('/artists/:id', (req, res) => {
      unqmod.getUNQfy().removeArtist(req.model.id);
      res.json({ success: true});
    });
  }
};