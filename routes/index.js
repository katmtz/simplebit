/*
 * Add route for '/'
 */
var path = require('path');
var root = { root: path.join(__dirname, '../views') };

module.exports = function(app) {
  app.get('/', function(req, res) {
    if (!req.cookies['fitbit-passport-example']) {
      console.log('no cookie');
      res.sendFile('/index.html', root);
    } else {
      console.log('cookie');
      res.sendFile('/profile.html', root);
    }
  });
  
  return app;
}