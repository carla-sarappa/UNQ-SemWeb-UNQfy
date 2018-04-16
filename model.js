
class Repository{
    constructor(){
        this.artists = [];
    }
    addArtist(artist){
      this.artists.push(artist);
    }

    filterTracksBy(attr, values){
      console.log("<<<<< ", attr);
      
       let tracks = this.getTracks().filter(track => values.includes(track[attr]) );

       console.log(">>>> ", tracks);
       return tracks;
    }

    getAlbums(){
      return this.artists.reduce((accumulator, artist) => accumulator.concat(artist.albums) , []);
    }

    getTracks(){
      return this.getAlbums().reduce((accumulator, album) => accumulator.concat(album.tracks), []);
    }
}
class Artist {
  constructor(name, country){
    this.name = name;
    this.country = country;
    this.albums = [];
  }
}

class Album {
  constructor(name, year){
    
    this.name = name;
    this.year = year;
    this.tracks = [];
  }

}


class Track {
    constructor(name, duration, genre){
        this.genre = genre;
        this.name = name;
        this.duration = duration;
      }
}

module.exports = {
  Album, Track, Artist, Repository
};
