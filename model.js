
class Repository{
    constructor(){
        this.tracks = [];
    }

    filterTracksBy(attr, values){
       return this.tracks.filter(track => values.includes(track[attr]) );
    }
}
class Artist {}

class Track {
    constructor(name, duration, genre){
        this.genre = genre;
        this.name = name;
        this.duration = duration;
      }
}
class Album {
  constructor(name, duration){
    
    this.genres = [];
    this.name = name;
    this.duration = duration;
  }

}

module.exports = {
  Album, Track, Artist, Repository
};
