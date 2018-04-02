/**
 * Bind all routes to an app.
 */
module.exports = function(app, passport) {
  // 3rd party authentification (Fitbit)
  var authRoutes = require('./auth');
  app = authRoutes(app, passport);
  
  // Index
  var indexRoute = require('./index');
  app = indexRoute(app);
  
  return app;
}