const fs = require('fs');
const credentials = JSON.parse(fs.readFileSync('./unqfy_service/vendors/spotifyCreds.json', 'utf8'));
const credential_header = { Authorization: 'Bearer ' + credentials.access_token };

const rp = require('request-promise');

class Spotify {
    
  searchArtist(artistName){
    const options = {
      url: 'https://api.spotify.com/v1/search',
      headers: credential_header,
      qs: {
        type: 'artist',
        q: artistName
      },
      json: true    
    };
    
    return rp.get(options).then(body => body.artists.items[0]);
  }

  getAlbums(idArtist){
    const options = {
      url: `https://api.spotify.com/v1/artists/${idArtist}/albums`,
      headers: credential_header,
      json: true    
    };
    
    return rp.get(options).then(body => body.items);
  }
  
  getAlbumsForArtistName(name){
    return this.searchArtist(name)
      .then(artist => artist.id )
      .then( id => this.getAlbums(id) );
  }

}

const spotify = new Spotify();

// spotify.searchArtist("Charly Garcia").then(body => {
//   console.log('body:', body); 
// });

// spotify.getAlbums('3jO7X5KupvwmWTHGtHgcgo').then(body => {
//   console.log('body:', body);
// });

// spotify.getAlbumsForArtistName("Charly Garcia").then(body => {
//   console.log('body:', body); 
// });

module.exports = {
  Spotify
};