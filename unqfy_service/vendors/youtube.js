const fs = require('fs');
const credentials = JSON.parse(fs.readFileSync('./vendors/youtubeCreds.json', 'utf8'));
const rp = require('request-promise');

class Youtube {

  searchVideos(artistName){
    const options = {
      url: 'https://www.googleapis.com/youtube/v3/search',
      // GET https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=muse&key={YOUR_API_KEY}
      qs: {
        part: 'snippet',
        maxResults: 3,
        q: artistName,
        type: 'video',
        key: credentials.key
      },
      json: true
    };

    return rp.get(options)
      .then(body => body.items.map(item=>'https://www.youtube.com/watch?v='+ item.id.videoId));
  }
}


module.exports = {
  Youtube
};