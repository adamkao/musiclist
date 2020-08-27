const Album = require('../../models/album.js');
const Artist = require('../../models/artist.js');
const appConfig = require('../../config.js');
const Discogs = require('disconnect').Client;
const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/user.js');

const router = express.Router();

// configure mongoose promises
mongoose.Promise = global.Promise;

// configure Discogs
const discogsClient = new Discogs('MusicList-ideogram', {
  consumerKey: appConfig.discogs.key,
  consumerSecret: appConfig.discogs.secret,
});
const discogsDB = discogsClient.database();

// Check if album exists and if not, save it
const saveAlbum = async (albumInfo) => {
  let errors = false;
  const albumQuery = await Album.findOne({ discogsId: albumInfo.id });
  if (!albumQuery) {
    const albumInfoModified = Object.assign({ discogsId: albumInfo.id }, albumInfo);
    const newAlbum = new Album(albumInfoModified);
    await newAlbum.save((error) => {
      if (error) { errors = true; }
    });
  }
  if (errors) {
    return false;
  }
  return true;
};

// Check each artist in an array to see if it exists and if not, save it
const saveArtists = async (artists) => {
  const formattedArtists = artists.map((artist) => {
    const newArtist = Object.assign({ discogsId: artist.id }, artist);
    return newArtist;
  });
  try {
    const result = await new Promise((resolve) => {
      Artist.insertMany(
        formattedArtists,
        { ordered: false },
        (error) => {
          if (error && error.code !== 11000) {
            resolve(false);
          }
          resolve(true);
        },
      );
    });
    return result;
  } catch (error) {
    if (error.code !== 11000) {
      return false;
    }
    return true;
  }
};

// POST to /add
router.post('/add', async (req, res) => {
  // Make sure a user's actually logged in
  if (!req.user) {
    return res.json({ error: 'User not logged in' });
  }

  // Wrap discogs API call in a promise so we can use async / await
  const discogsGetMaster = albumId => new Promise((resolve) => {
    discogsDB.getMaster(albumId, (err, data) => {
      resolve(data);
    });
  });

  // Get a single artist from Discogs
  const discogsGetArtist = artistId => new Promise((resolve) => {
    discogsDB.getArtist(artistId, (err, data) => {
      resolve(data);
    });
  });

  // Loop through artists and hit the Discogs API for each
  const getArtists = async (artists) => {
    const results = artists.map((artist) => {
      const artistInfo = discogsGetArtist(artist.id);
      return artistInfo;
    });
    return Promise.all(results);
  };

  const albumId = parseInt(req.body.id, 10);
  let result;

  try {
    // Get album info from discogs API
    const albumInfo = await discogsGetMaster(albumId);

    // Save it to the MusicList DB if it's not already there
    const albumSaved = await saveAlbum(albumInfo);
    if (!albumSaved) { return JSON.stringify(new Error('There was a problem saving the album to the database.')); }

    // Go through the album's artists and get their full info from Discogs
    const artistsInfo = await getArtists(albumInfo.artists);

    // Save the artists to the MusicList DB if they're not already there
    const artistsSaved = await saveArtists(artistsInfo);
    console.log(artistsSaved);
    if (!artistsSaved) { return JSON.stringify(new Error('There was a problem saving the artist to the database.')); }

    // Find the user we want to save to
    const query = User.findOne({ email: req.user.email });
    const foundUser = await query.exec();

    // Sanity Check! Is the album already added?
    const albumIndex = foundUser.albums.indexOf(albumInfo.id);
    if (albumIndex < 0) {
      foundUser.albums.push(albumInfo.id);
    }

    // Sanity Check 2! Is the artist already added?
    for (let i = 0; i < albumInfo.artists.length; i += 1) {
      const artistIndex = foundUser.artists.indexOf(albumInfo.artists[i].id);
      if (artistIndex < 0) {
        foundUser.artists.push(...albumInfo.artists.map(artist => artist.id));
      }
    }

    foundUser.save((error) => {
      if (error) {
        result = res.json({ error: 'Album could not be saved. Please try again.' });
      } else {
        result = res.json(foundUser);
      }
    });
  } catch (err) {
    result = res.json({ error: 'There was an error saving the album to the database. Please try again.' });
  }
  return result;
});

// Post to delete
router.post('/delete', (req, res, next) => {
  User.findOne({ username: req.user.username }, (err, foundUser) => {
    // Run filter against the array, returning only those that don't match the passed ID
    const newAlbums = foundUser.albums.filter(album => album !== req.body.albumId);
    foundUser.update({ $set: { albums: newAlbums } }, (error) => {
      if (error) {
        return res.json(JSON.stringify({ error: 'There was an error removing the album from the user profile' }));
      }
      return res.json({ albums: newAlbums });
    });
  });
});

// POST to /populate
router.post('/populate', (req, res, next) => {
  // Get album data from an array
  Album.find({
    discogsId: { $in: req.body },
  }, (err, albums) => {
    if (err) {
      return res.json({ error: err.message });
    }
    return res.json(albums);
  });
});

var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, res) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, res);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getChannel(auth, res) {
  var service = google.youtube('v3');
  service.playlists.list({
    auth: auth,
    part: 'id,snippet',
    mine: true,
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var items = response.data.items;
    if (items.length === 0) {
      console.log('No channel found.');
    } else {
      console.log('This ID is %s. title is \'%s\'.',
                  items[0].id,
                  items[0].snippet.title);
      console.log(JSON.stringify(items));
      res.json(items);
    }
  });
}
/*
// POST to /search
router.post('/search', async (req, res) => {
  // Contact Discogs API
  await discogsDB.search(req.body, (err, data) => {
    if (err) {
      const error = new Error(err);
      return res.json(error);
    }
    return res.json(data);
  });
});
*/

// POST to /search
router.post('/search', async (req, res) => {
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the YouTube API.
    authorize(JSON.parse(content), getChannel, res);
  });
});

module.exports = router;
