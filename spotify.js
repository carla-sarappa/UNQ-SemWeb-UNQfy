const fs = require('fs');
const credentials = JSON.parse(fs.readFileSync('./spotifyCreds.json', 'utf8'));

const rp = require('request-promise');

class Spotify {
    
  searchArtist(artistName){

    const options = {
      url: 'https://api.spotify.com/v1/search',
      headers: { Authorization: 'Bearer ' + credentials.access_token },
      qs: {
        type: 'artist',
        q: artistName
      },
      json: true    
    };
    
    return rp.get(options);
  }
    
}

const spotify = new Spotify();
spotify.searchArtist("Charly Garcia").then( (body) => {
  console.log('body:', body); // Print the HTML for the Google homepage.
});

module.exports = {
  Spotify
};