const appConfig = require('../../config.js');
const Discogs = require('disconnect').Client;
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// configure mongoose promises
mongoose.Promise = global.Promise;

// configure Discogs
const discogsClient = new Discogs('MusicList-ideogram', {
  consumerKey: appConfig.discogs.key,
  consumerSecret: appConfig.discogs.secret,
});
const discogsDB = discogsClient.database();

console.log('discogs');
// POST to /search
router.post('/search', async (req, res) => {
  // Contact Discogs API
  console.log('post');
  await discogsDB.search(req.body, (err, data) => {
    if (err) {
      console.log('error: ', err);
      const error = new Error(err);
      return res.json(error);
    }
    console.log('success: ', data);
    return res.json(data);
  });
});

module.exports = router;
