// REST API Endpoints
const artists = require('./api/artists');
const albums = require('./api/albums');
const errors = require('./api/errors');
const config = require ('./config');

// MODEL
const unqmod = require('./unqfy');

// EXPRESS
const express = require('express'); // call express
const app = express(); // define our app using express
const bodyParser = require('body-parser');

const router = express.Router();
const port = process.env.PORT || config.UNQFY_PORT; // set our port
const model = { };

// JSON Parser (string body -> object)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Middleware for logging and saving unqfy.
router.use((req, res, next) => {
  
  console.log('REQUEST: ', req.body);

  // Load unqfy before processing the request.
  model.unqfy = unqmod.getUNQfy();

  // Save unqfy once we finish generating a response.
  res.on('finish', () => {
    model.unqfy.save('estado');
  });

  // Execute next middleware in the chain.
  next();
});

// Declare 'api' as our root url.
app.use('/api', router);

// Parse ID path arguments so we can match :id on our url paths.
router.param('id', (req, res, next, id) => {
  req.model = {
    id: parseInt(id),
  };
  next();
});

// Register our custom endpoints.
artists.register(router, model);
albums.register(router, model);

// Error handler. Return any exception as an error in json format.
app.use((err, req, res, next) => {

  if (err.status === 400 && err.type === 'entity.parse.failed') {
    // On JSON parsing error
    res.status(400);
    res.json(errors.ERRORS.BAD_REQUEST);

  } else if (err.errorType) {
    // On business error
    const jsonError = errors.buildJsonErrorFrom(err);
    res.status(jsonError.status);
    res.json(jsonError);

  } else if (res.json) {
    // On unexpected app exception
    res.json({error : err});

  } else {
    // On HTTP resource not found
    next();
  }
});

app.use((req, res) => {
  res.contentType('json');
  res.status(errors.ERRORS.RESOURCE_NOT_FOUND.status);
  res.send(JSON.stringify(errors.ERRORS.RESOURCE_NOT_FOUND));
});

// Start server.
app.listen(port);
console.log('Magic happens on port ' + port);

