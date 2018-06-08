const picklejs = require('picklejs');
const Promise = require('bluebird');
const fs = require('fs'); // necesitado para guardar/cargar unqfy
const model = require('./model/model');
const spotify = require('./spotify');
const musixmatch = require('./musixmatch');
const errors = require('./api/errors');

class UNQfy {
  constructor() {
    this.repository = new model.Repository();
  }

  getTracksMatchingGenres(genres) {
    // Debe retornar todos los tracks que contengan alguno de los generos en el parametro genres

    return this.repository.filterTracksBy('genre', genres);
  }

  getTracksMatchingArtist(artistName) {
    let artist = this.getArtistByName(artistName);

    return artist.albums.reduce((accumulator, album) => accumulator.concat(album.tracks), []);
  }

  /* Debe soportar al menos:
     params.name (string)
     params.country (string)
  */
  addArtist(params) {
    // El objeto artista creado debe soportar (al menos)
    // las propiedades name (string) y country (string)
    if (!params.name || !params.country) throw errors.BAD_REQUEST;

    this._checkPreconditionNameDoesNotExist(this.getArtists(), params.name);

    const artist = this.repository.createArtist(params.name, params.country);
    return artist;
  }

  /* Debe soportar al menos:
      params.name (string)
      params.year (number)
  */
  addAlbum(artistName, params) {
    if (!params.name || !params.year) throw errors.BAD_REQUEST;

    // El objeto album creado debe tener (al menos) las propiedades name (string) y year
    const artist = this.getArtistByName(artistName);

    return this.repository.createAlbum(artist, params.name, params.year);
  }

  addAlbumToArtist(params) {
    console.log('addAlbumToArtist: ', params);

    if (!params.name || !params.year || isNaN(params.artistId)) throw errors.BAD_REQUEST;

    this._checkPreconditionNameDoesNotExist(this.getAlbums(), params.name);

    const artist = this.repository.findArtistById(params.artistId)[0];

    if (!artist) throw errors.RELATED_RESOURCE_NOT_FOUND;

    return this.repository.createAlbum(artist, params.name, params.year);
  }

  _checkPreconditionNameDoesNotExist(entities, name) {
    console.log(entities);
    const alreadyExists = entities
      .some(e => e.name.toLowerCase() === name.toLowerCase());

    if (alreadyExists) throw errors.RESOURCE_ALREADY_EXISTS;
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
    const artist = this.findArtistsByName(name)[0];
    if (!artist) throw errors.RESOURCE_NOT_FOUND;
    return artist;
  }

  findArtistsByName(name = '') {
    return this._findByName(this.repository.getArtists(), name);
  }

  findAlbumsByName(name = '') {
    return this._findByName(this.repository.getAlbums(), name);
  }

  getArtistById(id) {
    const artist = this.repository.findArtistById(id)[0];
    if (!artist) throw errors.RESOURCE_NOT_FOUND;
    return artist;
  }

  removeArtist(id) {
    const artist = this.getArtistById(id);
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
    const album = this.findAlbumsByName(name)[0];
    if (!album) throw errors.RESOURCE_NOT_FOUND;
    return album;
  }

  getAlbumById(id) {
    const album = this.repository.findAlbumById(id)[0];
    if (!album) throw errors.RESOURCE_NOT_FOUND;

    return album;
  }

  removeAlbum(id) {
    const album = this.getAlbumById(id);
    const artist = this.getArtistById(album.artistId);
    artist.removeAlbum(album);
  }

  getTrackByName(name) {
    const track = this.repository.getTracks().find(track => name === track.name);

    if (!track) throw errors.RESOURCE_NOT_FOUND;
    return track;
  }

  getPlaylistByName(name) {
    const playlist = this.repository.playlists.find(playlist => name == playlist.name);
    if (!playlist) throw errors.RESOURCE_NOT_FOUND;
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
      ).then(albums => albums.map(a => this.addAlbumToArtist(a)));
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
    new picklejs.FileSerializer().serialize(filename, this);
  }

  static load(filename = 'unqfy.json') {
    const fs = new picklejs.FileSerializer();
    // TODO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, model.Album, model.Track, model.Artist, model.Repository, model.Playlist];
    fs.registerClasses(...classes);

    return fs.load(filename);
  }
}

function getUNQfy() {

  const filename = 'estado';
  let unqfy = new UNQfy();

  if (fs.existsSync(filename)) {
    unqfy = UNQfy.load(filename);
  }
  return unqfy;
}

module.exports = {
  UNQfy,
  getUNQfy
};

