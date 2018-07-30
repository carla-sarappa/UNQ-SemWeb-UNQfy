const rp = require('request-promise');
const config = require ('../config');


class Notifier {

  notifyNewAlbum(artist, album){
    const options = {
      url: `${config.NOTIF_URL}/api/notify`,
      body: {
        artistId: artist.id,
        subject: `Nuevo Album para artista ${artist.name}`,
        message: `Se ha agregado el album ${album.name} al artista ${artist.name}`,
        from: 'UNQfy Sender <unqfysender@gmail.com>'
      },
      json: true
    };

    return rp.post(options);
  }

  notifyArtistRemoved(artistId){
    const options = {
      url: `${config.NOTIF_URL}/api/subscriptions`,
      body: {
        artistId: artistId
      },
      json: true
    };

    return rp.delete(options);
  }

}


module.exports = {
  Notifier
};