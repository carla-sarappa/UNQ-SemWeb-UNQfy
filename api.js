// REST API Endpoints
const artists = require('./api/artists');
const albums = require('./api/albums');

// MODEL
const unqmod = require('./unqfy');

// EXPRESS
const express = require('express'); // call express
const app = express(); // define our app using express
const bodyParser = require('body-parser');

const router = express.Router();
const port = process.env.PORT || 5000; // set our port
const unqfy = unqmod.getUNQfy();

// JSON Parser (string body -> object)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Middleware
router.use((req, res, next) => {
  
  console.log('REQUEST: ', req.body);

  // Save unqfy once we finish generating a response.
  res.on('finish', () => {
    unqfy.save('estado');
  });

  // Execute next middleware in the chain.
  next();
});

// Declare 'api' as our root url.
app.use('/api', router);

// Error handler. Return any exception as an error in json format.
app.use((err, req, res) => {
  console.log('ERROR: ', err);
  res.json({error : err});
});

// Parse ID path arguments so we can match :id on our url paths.
router.param('id', (req, res, next, id) => {
  req.model = {
    id: parseInt(id),
  };
  next();
});

// Register our custom endoints.
artists.register(router, unqfy);
albums.register(router, unqfy);

// Start server.
app.listen(port);
console.log('Magic happens on port ' + port);

