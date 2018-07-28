const rp = require('request-promise');

class UnqfyClient {

  searchArtist(artistName){
    const options = {
      url: 'http://localhost:5000/api/artists',

      qs: {
        name: artistName,
      },
      json: true
    };

    return rp.get(options);
  }

}

module.exports = {
  UnqfyClient
};