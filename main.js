

const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy');

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename) {
  let unqfy = new unqmod.UNQfy();
  
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

// Guarda el estado de UNQfy en filename
function saveUNQfy(unqfy, filename) {
  unqfy.save(filename);
}

class Command {

  constructor(arity, help, block) {
    this.help = help;
    this.arity = arity;
    this.block = block;
  }

  execute(args) {
    if (args.length !== this.arity) {
      console.log("Usage:");
      console.log("    ", this.help);
      console.log("\n\nUse the command 'help' for listing the available commands.");
    } else {
      try {
        return this.block(args);
      } catch(e) {
        return "ERROR: " + e;
      }
    }
  }
}

class CommandFactory {
  constructor() {
    this.commands = {};
  }

  create(commandName, arity, help, block) {
    this.commands[commandName] = new Command(arity, help, block);
  }
  
  loadCommands(unqfy) {

    this.create('add-artist', 2, 'add-artist <artist name> <artist country>', (args) => { 
      const artist = { name: args[0], country: args[1] };
      unqfy.addArtist(artist);
      return "Artist added: " + artist.name;
    });

    this.create('get-artist', 1, 'get-artist <artist name>', (args) => { 
      return unqfy.getArtistByName(args[0]);
    });

    this.create('add-album', 3, 'add-album <artist name> <album name> <album year>', (args) => { 
      const album = { name: args[1], year: args[2] };
      unqfy.addAlbum(args[0], album);
      return "Album added: " + album.name;
    });

    this.create('get-album', 1, 'get-album <album name>', (args) => { 
      return unqfy.getAlbumByName(args[0]);
    });

    this.create('add-track', 4, 'add-track <album name> <track name> <track duration> <track genre>', (args) => { 
      const track = { name: args[1], duration: args[2], genre: args[3] };
      unqfy.addTrack(args[0], track);
      return "Track added: " + track.name;
    });

    this.create('get-track', 1, 'get-track <track name>', (args) => { 
      return unqfy.getTrackByName(args[0]);
    });

    this.create('add-playlist', 3, 'add-playlist <playlist name> <playlist genre> <playlist duration>', (args) => { 
      const playlist = { name: args[0], genre: args[1], duration: args[2] };
      unqfy.addPlaylist(playlist);
      return "Playlist added: " + playlist.name;
    });

    this.create('get-playlist', 1, 'get-playlist <playlist name>', (args) => { 
      return unqfy.getPlaylistByName(args[0]);
    });

    this.create('get-tracks-matching-genres', 20, 'get-tracks-matching-genres <genre1 [, genre2 ...]>', (args) => { 
      return unqfy.getTracksMatchinGenres(args);
    });

    this.create('get-tracks-matching-artist', 1, 'get-tracks-matching-artist <artist name>', (args) => { 
      return unqfy.getTracksMatchinArtist(args[0]);
    });

    const commandHelp = "Available commands: \n\n" + Object.values(this.commands).map((c)=> '    ' + c.help + '\n').join('');

    this.create('help', 0, commandHelp, (args)=> commandHelp);

    return this.commands;
  }
}

function main() { 
  const unqfy = getUNQfy('estado');
  
  // pickle.js esta loggeando el estado, esto es para separarlo del resultado del comando
  console.log("\n========================================================================\n");


  const args = process.argv.slice(2);
  const action = args[0];
  const commandArguments = args.slice(1);

  const result = new CommandFactory()
    .loadCommands(unqfy)[action]
    .execute(commandArguments);

  if (result) {
    console.log(result);
  }  
  
  saveUNQfy(unqfy, 'estado');
}

main();


