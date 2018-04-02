// App init
const express = require('express');
var app = express();

// Session and cookies
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expressSession({ secret:'observingboats', resave: true, saveUninitialized: true, maxAge: (90 * 24 * 3600000) }));

// Static-served Files
app.use(express.static('public'));
app.use(express.static('views'));

// Passport
var passport = require('passport');
var FitbitStrategy = require( 'passport-fitbit-oauth2' ).FitbitOAuth2Strategy;
 
passport.use(new FitbitStrategy({
    clientID:     process.env.FITBIT_CLIENT_ID,
    clientSecret: process.env.FITBIT_SECRET,
    callbackURL:  process.env.FITBIT_CALLBACK
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, {
      accessToken:  accessToken,
      refreshToken: refreshToken,
      profile:      profile
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

module.exports = [app, passport];