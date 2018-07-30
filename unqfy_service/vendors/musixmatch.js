const fs = require('fs');
const credentials = JSON.parse(fs.readFileSync('./vendors/musixmatchCreds.json', 'utf8'));
const rp = require('request-promise');

class Musixmatch {
    
  searchTrack(trackName){
    const options = {
      url: 'https://api.musixmatch.com/ws/1.1/track.search',
      
      qs: {
        q_track: trackName,
        s_track_rating: 'desc',
        apikey: credentials.apikey
      },
      json: true    
    };
    
    return rp.get(options).then(body => body.message.body.track_list[0]);
  }

  getLyrics(idTrack){
    const options = {
      url: 'https://api.musixmatch.com/ws/1.1/track.lyrics.get',
      qs: {
        track_id: idTrack,
        apikey: credentials.apikey
      },
      json: true    
    };
    
    return rp.get(options).then(body => body.message.body.lyrics.lyrics_body);
  }
  
  getLyricsFromTrackName(name){
    return this.searchTrack(name)
      .then(track => track.track.track_id )
      .then( id => this.getLyrics(id) );
  }

}

const musixmatch = new Musixmatch();

// musixmatch.searchTrack("Despacito").then(body => {
//     console.log('body:', body);
// });

// musixmatch.getLyrics("129385004").then(body => {
//     console.log('body:', body);
// });

// musixmatch.getLyricsFromTrackName("Despacito").then(body => {
//     console.log('body:', body);
// });


module.exports = {
  Musixmatch
};