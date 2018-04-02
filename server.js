// server.js
// where your node app starts
// the process.env values are set in .env
var [app,passport] = require('./lib/appconfig');

var routeBinder = require('./routes/bind');
app = routeBinder(app, passport);

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
