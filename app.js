const appConfig = require('./config.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const express = require('express');
const expressSession = require('express-session');
const favicon = require('serve-favicon'); //eslint-disable-line
const helmet = require('helmet');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const YoutubeV3Strategy = require('passport-youtube-v3').Strategy;
const path = require('path');
const RateLimit = require('express-rate-limit');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const User = require('./models/user');

// Route Files
const api = require('./routes/api/index');
const albums = require('./routes/api/albums');
const artists = require('./routes/api/artists');
const authentication = require('./routes/api/authentication');
const playlists = require('./routes/api/playlists');
const index = require('./routes/index');
const users = require('./routes/api/users');

const app = express();
// Connect Mongoose
mongoose.connect('mongodb://localhost/musiclist');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());

// Express Session
const sessionValues = {
  cookie: {},
  name: 'sessionId',
  resave: false,
  saveUnitialized: true,
  secret: appConfig.expressSession.secret,
};
if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sessionValues.cookie.secure = true;
}
app.use(expressSession(sessionValues));
app.use(helmet());
/*
app.use(passport.initialize());
app.use(passport.session());
*/
app.use(express.static(path.join(__dirname, 'public')));

// Webpack Server
if (process.env.NODE_ENV !== 'production') {
  const webpackCompiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: true,
      'errors-only': true,
    },
  }));
  app.use(webpackHotMiddleware(webpackCompiler, {
    log: console.log,
  }));
}

passport.use(new YoutubeV3Strategy(
  {
    clientID: appConfig.youtube.id,
    clientSecret: appConfig.youtube.secret,
    scope: ['https://www.googleapis.com/auth/youtube'],
    callbackURL: '/authentication/googlecb',
  },
  () => {
    console.log('// passport callback');
  },
));

app.use(passport.initialize());

app.get('/authenticate', passport.authenticate('youtube'));

app.use('/api', api);
// configure rate limiter
const apiLimiter = new RateLimit({
  windowMS: 1 * 60 * 1000, // 1 minute
  max: 50,
  delayMs: 0, // disabled
});
app.use('/api/', apiLimiter);
app.use('/api/albums', albums);
app.use('/api/artists', artists);
app.use('/api/authentication', authentication);
app.use('/api/playlists', playlists);
app.use('/api/users', users);
app.use('/*', index);

// Configure Passport
/*
passport.use(new LocalStrategy(User.authenticate()));

passport.use(new YoutubeV3Strategy(
  {
    clientID: appConfig.youtube.id,
    clientSecret: appConfig.youtube.secret,
    callbackURL: 'http://localhost:3000/api/albums/redirect',
    scope: ['https://www.googleapis.com/auth/youtube'],
  },
  function (accessToken, refreshToken, profile, cb) {
    console.log('YoutubeV3Strategy ' + accessToken);
    const user = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    return cb(null, user);
  },
));
*/
/*
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
*/
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const
  err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
