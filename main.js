

const fs = require('fs'); // necesitado para guardar/cargar unqfy
const unqmod = require('./unqfy');

// Retorna una instancia de UNQfy. Si existe filename, recupera la instancia desde el archivo.
function getUNQfy(filename) {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    console.log();
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

// Guarda el estado de UNQfy en filename
function saveUNQfy(unqfy, filename) {
  console.log();
  unqfy.save(filename);
}

function main() { 
  let unqfy = getUNQfy('estado');

  console.log('arguments: ');

  let args = process.argv.slice(2);
  
  args.forEach(argument => console.log(argument));
  let action = args[0];
  console.log(" -------------------------------- ");

  let result = unqfy[action](args[1], {genre: args[2]});
  console.log(result);
  

  saveUNQfy(unqfy, 'estado');
}

main();


