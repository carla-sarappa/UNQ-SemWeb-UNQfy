

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

  console.log("Result: \n");
  console.log(result);
  
  saveUNQfy(unqfy, 'estado');
}

main();


