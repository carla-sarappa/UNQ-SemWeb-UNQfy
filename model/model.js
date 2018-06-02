
class Repository{
  constructor(){
    this.artists = [];
    this.playlists = [];
  }
  addArtist(artist){
    this.artists.push(artist);
  }

  filterTracksBy(attr, values){
    let tracks = this.getTracks().filter(track => values.includes(track[attr]) );
    return tracks;
  }

  getAlbums(){
    return this.artists.reduce((accumulator, artist) => accumulator.concat(artist.albums) , []);
  }

  getTracks(){
    return this.getAlbums().reduce((accumulator, album) => accumulator.concat(album.tracks), []);
  }

  getAlbumsForArtist(artistName){
    return this.artists
      .filter(artist => artist.name == artistName)
      .reduce((accumulator, artist) => accumulator.concat(artist.albums) , []);
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

class Playlist {
  constructor(name, maxDuration){
    this.name = name;
    this.maxDuration = maxDuration;
    this.tracks = [];
  }

  name(){
    return this.name;
  }

  duration(){
    return this.tracks.reduce((accumulator, track) => accumulator + track.duration, 0);
  }
  hasTrack(aTrack){
    return this.tracks.some(track => track.name == aTrack.name);
  }

  fetchUntilMaxDuration(ts, maxDuration){
    let duracionAcumulada = 0;
    let tracksPermitidos = []; 
    let i = 0;
    // preguntar en clase como hacer esto sin while
    while (i < ts.length ) {
      if(duracionAcumulada + ts[i].duration <= maxDuration){
        tracksPermitidos.push(ts[i]);
        duracionAcumulada += ts[i].duration;
      }       
      i++; 
    } 
    return tracksPermitidos;
  }

  selectAndAddTracks(tracksDisponibles, maxDuration){
    this.tracks = this.tracks.concat(this.fetchUntilMaxDuration(tracksDisponibles, maxDuration));
  }

}

module.exports = {
  Album, Track, Artist, Playlist, Repository
};
