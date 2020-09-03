const appConfig = require('./config.js');
const express = require('express');
const passport = require('passport');
const YoutubeV3Strategy = require('passport-youtube-v3').Strategy;

passport.use(new YoutubeV3Strategy({
  clientID: appConfig.youtube.id,
  clientSecret: appConfig.youtube.secret,
  callbackURL: 'http://localhost:8888/redirect',
  scope: ['https://www.googleapis.com/auth/youtube'],
},
function (accessToken, refreshToken, profile, cb) {
  const user = {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
  return cb(null, user);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const app = express();

app.use(passport.initialize());

app.get('/authenticate', passport.authenticate('youtube'));
app.get('/redirect', passport.authenticate('youtube', { failureRedirect: '/login' }),
function (req, res) {
    console.log(req.user.accessToken);
    res.redirect('http://localhost:3000/api/authentication/login2/?access_token=' + req.user.accessToken);
});

app.listen(8888);
