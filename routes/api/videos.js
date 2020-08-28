const appConfig = require('../../config.js');
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const router = express.Router();

mongoose.Promise = global.Promise;

const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';

function authorize(credentials, callback, res, list, pageToken) {
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
      callback(oauth2Client, res, list, pageToken);
    }
  });
}

function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
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

function getPlaylists(auth, res, list, pageToken) {
  const service = google.youtube('v3');
  service.playlists.list({
    auth: auth,
    part: 'id,snippet',
    maxResults: 50,
    mine: true,
    pageToken: pageToken,
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    const newList = list.concat(response.data.items);
    const nextPageToken = response.data.nextPageToken;
    if (nextPageToken) {
      console.log('nextPageToken is %s', nextPageToken);
      getPlaylists(auth, res, newList, nextPageToken);
    } else {
      res.json(newList.sort((a, b) => ((a.snippet.title < b.snippet.title) ? -1 : 1)));
    }
  });
}

// POST to /search
router.post('/search', async (req, res) => {

});
