


module.exports = {
  register: router => {
    router.get('/albums', (req, res) => {
      res.json({ message: 'hooray! welcome to our api!' });
    });
      
    router.post('/albums', (req, res) => {
      res.json({ message: 'hooray! welcome to our api!' });
    });
      
    router.delete('/albums', (req, res) => {
      res.json({ message: 'hooray! welcome to our api!' });
    });
  }
};