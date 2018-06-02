const artists = require('./api/artists');
const albums = require('./api/albums');

const express = require('express'); // call express
const app = express(); // define our app using express
const router = express.Router();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000; // set our port

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

router.use(function(req, res, next) {
  // do logging
  console.log(req.body);
  next();
  });

router.get('/', (req, res) => {
  res.json({ message: 'hooray! welcome to our api!' });
});
app.use('/api', router);

router.param('id', (req, res, next, id) => {
  req.model = {
    id: id,
  };
  next();
});

artists.register(router);
albums.register(router);

app.listen(port);
console.log('Magic happens on port ' + port);

