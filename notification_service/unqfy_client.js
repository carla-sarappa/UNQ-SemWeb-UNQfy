const rp = require('request-promise');
const config = require ('./config');

class UnqfyClient {

  searchArtist(artistName){
    const options = {
      url: `${config.UNQFY_URL}/api/artists`,

      qs: {
        name: artistName,
      },
      json: true
    };

    return rp.get(options);
  }

  getArtist(artistId){
    const options = {
      url: `${config.UNQFY_URL}/api/artists/${artistId}`,
      json: true
    };

    return rp.get(options);
  }
}

module.exports = {
  UnqfyClient
};