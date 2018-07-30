const { picklify, unpicklify } = require('picklify');
const Promise = require('bluebird');
const fs = require('fs'); // necesitado para guardar/cargar unqfy
const model = require('./model/model');
const spotify = require('./vendors/spotify');
const musixmatch = require('./vendors/musixmatch');
const validations = require('./model/business_errors');
const notifier = require('./vendors/notifier');

class UNQfy {
  constructor() {
    this.repository = new model.Repository();

  }

  setUpListeners(){
    this.repository.setOnNewAlbumListener((artist, album)=>{
      new notifier.Notifier().notifyNewAlbum(artist, album);
    });
    this.repository.setOnArtistRemovedListener((artistId)=>{
      new notifier.Notifier().notifyArtistRemoved(artistId);
    });
  }
  getTracksMatchingGenres(genres) {
    // Debe retornar todos los tracks que contengan alguno de los generos en el parametro genres

    return this.repository.filterTracksBy('genre', genres);
  }

  getTracksMatchingArtist(artistName) {
    return this.getArtistByName(artistName)
      .albums
      .reduce((accumulator, album) => accumulator.concat(album.tracks), []);
  }

  /* Debe soportar al menos:
     params.name (string)
     params.country (string)
  */
  addArtist(params) {
    // El objeto artista creado debe soportar (al menos)
    // las propiedades name (string) y country (string)
    validations.InvalidArgumentException.unlessHasFields(params, ['name', 'country']);
    validations.EntityAlreadyExistsException.ifNameAlreadyExists(this.getArtists(), params.name);

    return this.repository.createArtist(params.name, params.country);
  }

  /* Debe soportar al menos:
      params.name (string)
      params.year (number)
  */
  addAlbum(artistName, params) {
    validations.InvalidArgumentException.unlessHasFields(params, ['name', 'year']);

    // El objeto album creado debe tener (al menos) las propiedades name (string) y year
    const artist = this.getArtistByName(artistName);

    return this.repository.createAlbum(artist, params.name, params.year);
  }

  addAlbumToArtist(params) {

    validations.InvalidArgumentException.unlessHasFields(params, ['name', 'year', 'artistId']);
    validations.EntityAlreadyExistsException.ifNameAlreadyExists(this.getAlbums(), params.name);

    const artist = this.repository.findArtistById(params.artistId)[0];

    if (!artist) throw new validations.RelatedEntityNotFoundException(`Unable to find artist with id=${params.artistId}`);

    return this.repository.createAlbum(artist, params.name, params.year);
  }

  /* Debe soportar (al menos):
       params.name (string)
       params.duration (number)
       params.genres (lista de strings)
  */
  addTrack(albumName, params) {
    /* El objeto track creado debe soportar (al menos) las propiedades:
         name (string),
         duration (number),
         genres (lista de strings)
    */
    const album = this.getAlbumByName(albumName);

    album.tracks.push(new model.Track(params.name, params.duration, params.genre));
  }

  getArtists() {
    return this.repository.getArtists();
  }

  getArtistByName(name) {
    return validations.EntityNotFoundException.unlessResultExists(this.findArtistsByName(name));
  }

  findArtistsByName(name = '') {
    return this._findByName(this.repository.getArtists(), name);
  }

  findAlbumsByName(name = '') {
    return this._findByName(this.repository.getAlbums(), name);
  }

  getArtistById(id) {
    return validations.EntityNotFoundException.unlessResultExists(this.repository.findArtistById(id));
  }

  removeArtist(id) {
    this.getArtistById(id); // validate that artist exists
    this.repository.removeArtist(id);
  }

  getAlbums() {
    return this.repository.getAlbums();
  }

  _findByName(entities, name) {
    const lowerCaseName = name.toLowerCase();
    return entities.filter(entity => entity.name.toLowerCase().includes(lowerCaseName));
  }

  getAlbumByName(name) {
    return validations.EntityNotFoundException.unlessResultExists(this.findAlbumsByName(name));
  }

  getAlbumById(id) {
    return validations.EntityNotFoundException.unlessResultExists(this.repository.findAlbumById(id));
  }

  removeAlbum(id) {
    const album = this.getAlbumById(id);
    const artist = this.getArtistById(album.artistId);
    artist.removeAlbum(album);
  }

  getTrackByName(name) {
    const track = this.repository.getTracks().find(track => name === track.name);
    if (!track) throw new validations.EntityNotFoundException(`Track ${name} not found.`);
    return track;
  }

  getPlaylistByName(name) {
    const playlist = this.repository.playlists.find(playlist => name === playlist.name);
    if (!playlist) throw new validations.EntityNotFoundException(`Playlist ${name} not found.`);
    return playlist;
  }

  addPlaylist(name, genresToInclude, maxDuration) {
    /* El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist
    */
    const playlist = new model.Playlist(name, maxDuration);
    const tracksDisponibles = this.getTracksMatchingGenres(genresToInclude);
    playlist.selectAndAddTracks(tracksDisponibles, playlist.maxDuration);
    this.repository.playlists.push(playlist);
  }

  populateAlbumsForArtist(artistName) {
    const spoty = new spotify.Spotify();
    const artist = this.getArtistByName(artistName);

    return spoty.getAlbumsForArtistName(artistName)
      .then(albums =>
        albums.map(album => {
          return {
            name: album.name,
            year: album.release_date,
            artistId: artist.id
          };
        })
      ).then(albums => albums.map((a)=>{
        try {
          return this.addAlbumToArtist(a);
        } catch (e) {
          console.log('Warning: ' + e.message);
        }
      }));
  }
        

  getLyricsForTrack(trackName) {
    const track = this.getTrackByName(trackName);
    const musix = new musixmatch.Musixmatch();

    if (!track.lyrics) {
      return musix.getLyricsFromTrackName(trackName)
        .then(lyrics => {
          track.lyrics = lyrics;
          return lyrics;
        });
    }

    return Promise.resolve(track.lyrics);
  }


  save(filename = 'unqfy.json') {
    const serialized = picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serialized));
  }

  static load(filename = 'unqfy.json') {
    // TODO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, model.Album, model.Track, model.Artist, model.Repository, model.Playlist];
    const serialized = fs.readFileSync(filename);
    return unpicklify(JSON.parse(serialized), classes);
  }
}

function getUNQfy() {

  const filename = 'estado';
  let unqfy = new UNQfy();

  if (fs.existsSync(filename)) {
    unqfy = UNQfy.load(filename);

  }
  unqfy.setUpListeners();
  return unqfy;
}

module.exports = {
  UNQfy,
  getUNQfy
};

