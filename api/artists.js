



module.exports = {
  register: router => {
    router.get('/artists', (req, res) => {
      res.json({ message: 'hooray! welcome to our api!' });
    });

    router.post('/artists', (req, res) => {
      res.json({ message: 'hooray! welcome to our api!' });
    });

    router.delete('/artists', (req, res) => {
      res.json({ message: 'hooray! welcome to our api!' });
    });
  }
};