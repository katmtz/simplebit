// server.js
// where your node app starts
// the process.env values are set in .env
var express = require('express');
var app = express();
var expressSession = require('express-session');

// cookies are used to save authentication
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// set app up for cookie use
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(expressSession({ secret:'observingboats', resave: true, saveUninitialized: true, maxAge: (90 * 24 * 3600000) }));

// passport-fitbit-oauth2 setup
var passport = require('passport');
var FitbitStrategy = require( 'passport-fitbit-oauth2' ).FitbitOAuth2Strategy;
 
passport.use(new FitbitStrategy({
    clientID:     process.env.FITBIT_CLIENT_ID,
    clientSecret: process.env.FITBIT_SECRET,
    callbackURL: process.env.FITBIT_CALLBACK
  },
  function(accessToken, refreshToken, profile, done) {
    
    done(null, {
      accessToken: accessToken,
      refreshToken: refreshToken,
      profile: profile
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

// index route
app.get('/', function(req, res) {
  if (!req.cookies['fitbit-passport-example']) {
    res.sendFile(__dirname + '/views/index.html');
  } else {
    res.sendFile(__dirname + '/views/profile.html');
  }
});

// on clicking "logoff" the cookie is cleared
app.get('/logoff',
  function(req, res) {
    res.clearCookie('fitbit-passport-example');
    res.redirect('/');
  }
);

app.get('/auth/fitbit',
    passport.authenticate('fitbit', { scope: ['activity','heartrate','location','profile'] }));

app.get('/auth/fitbit/callback', 
  passport.authenticate('fitbit', 
    { successRedirect: '/setcookie', failureRedirect: '/' }
  )
);

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
      res.sendFile(__dirname + '/views/success.html');
    } else {
      res.redirect('/');
    }
  }
);

function requireLogin (req, res, next) {
  if (!req.cookies['github-passport-example']) {
    res.redirect('/');
  } else {
    next();
  }
};

function requireUser (req, res, next) {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
};

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
