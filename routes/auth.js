/*
 * Add routes for internal authentication, recieving authentication
 * response from Fitbit, setting cookies, etc.
 */
var path = require('path');
var root = { root: path.join(__dirname, '../views') };

module.exports = function(app, passport) {
  function requireLogin(req, res, next) {
    if (!req.cookies['fitbit-passport-example']) {
      res.redirect('/');
    } else {
      next();
    }
  }

  function requireUser(req, res, next) {
    if (!req.user) {
      res.redirect('/');
    } else {
      next();
    }
  }

  // on successful auth, a cookie is set before redirecting
  // to the success view
  app.get('/setcookie', requireUser,
    function(req, res) {
      if(req.get('Referrer') && req.get('Referrer').indexOf(process.env.PROJECT_DOMAIN)!=-1){
        res.cookie('fitbit-passport-example', new Date());
        res.redirect('/success');
      } else {
         res.redirect('/');
      }
    }
  );

  // if cookie exists, success. otherwise, user is redirected to index
  app.get('/success', requireLogin,
    function(req, res) {
      if(req.cookies['fitbit-passport-example']) {
        res.sendFile('/success.html', root);
      } else {
        res.redirect('/');
      }
    }
  );
  
  app.get('/logoff', function(req, res) {
    res.clearCookie('fitbit-passport-example');
    res.redirect('/');
  });
  
  app.get('/auth/fitbit',
    passport.authenticate('fitbit', { scope:['activity','heartrate','location','profile'] })
  );

  app.get('/auth/fitbit/callback', 
    passport.authenticate('fitbit', {
      successRedirect: '/setcookie',
      failureRedirect: '/' 
    })
  );

  
  return app;
}